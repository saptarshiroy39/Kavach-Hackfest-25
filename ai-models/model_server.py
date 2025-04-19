#!/usr/bin/env python
# -*- coding: utf-8 -*-

"""
Model Server for Project Hackfest-25

This script provides a Flask API for the AI models to be used by the backend.
It allows the backend to make predictions using the trained models.
"""

import os
import json
import numpy as np
import pandas as pd
from flask import Flask, request, jsonify
import logging

from threat_detection import ThreatDetectionModel
from anomaly_detection import AnomalyDetectionModel

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler("logs/model_server.log"),
        logging.StreamHandler()
    ]
)

logger = logging.getLogger("model_server")

# Create logs directory if it doesn't exist
os.makedirs("logs", exist_ok=True)

# Initialize Flask app
app = Flask(__name__)

# Load models
try:
    threat_model = ThreatDetectionModel(model_path="models/threat_detection_model.pkl")
    logger.info("Threat detection model loaded successfully")
except Exception as e:
    logger.error(f"Failed to load threat detection model: {str(e)}")
    threat_model = None

try:
    anomaly_model = AnomalyDetectionModel(
        model_type='isolation_forest',
        model_path="models/anomaly_detection_isolation_forest_model.pkl"
    )
    logger.info("Anomaly detection model loaded successfully")
except Exception as e:
    logger.error(f"Failed to load anomaly detection model: {str(e)}")
    anomaly_model = None

@app.route('/health', methods=['GET'])
def health_check():
    """Endpoint to check if the model server is running."""
    status = {
        'status': 'ok',
        'models': {
            'threat_detection': threat_model is not None,
            'anomaly_detection': anomaly_model is not None
        }
    }
    return jsonify(status)

@app.route('/predict/threat', methods=['POST'])
def predict_threat():
    """
    Endpoint to predict if a security event is a threat.
    
    Expected JSON input format:
    {
        "events": [
            {
                "event_duration": 120,
                "access_count": 5,
                "time_of_day": 3,
                ...
            },
            ...
        ]
    }
    """
    if threat_model is None:
        return jsonify({
            'error': 'Threat detection model not available'
        }), 503
    
    try:
        data = request.get_json()
        
        if not data or 'events' not in data:
            return jsonify({
                'error': 'Invalid request format. Expected JSON with "events" array.'
            }), 400
        
        events = data['events']
        df = pd.DataFrame(events)
        
        # Get predictions
        probabilities = threat_model.predict(df)
        predictions = threat_model.classify(df)
        
        # Format response
        results = []
        for i, event in enumerate(events):
            results.append({
                'event': event,
                'probability': float(probabilities[i]),
                'is_threat': bool(predictions[i])
            })
        
        return jsonify({
            'results': results
        })
    
    except Exception as e:
        logger.error(f"Error processing threat prediction request: {str(e)}")
        return jsonify({
            'error': f'Error processing request: {str(e)}'
        }), 500

@app.route('/predict/anomaly', methods=['POST'])
def predict_anomaly():
    """
    Endpoint to detect if a security event is anomalous.
    
    Expected JSON input format:
    {
        "events": [
            {
                "login_frequency": 10,
                "data_transfer_volume": 500,
                "action_count": 15,
                ...
            },
            ...
        ]
    }
    """
    if anomaly_model is None:
        return jsonify({
            'error': 'Anomaly detection model not available'
        }), 503
    
    try:
        data = request.get_json()
        
        if not data or 'events' not in data:
            return jsonify({
                'error': 'Invalid request format. Expected JSON with "events" array.'
            }), 400
        
        events = data['events']
        df = pd.DataFrame(events)
        
        # Get predictions
        scores = anomaly_model.detect(df)
        predictions = anomaly_model.classify_anomalies(df)
        
        # Format response
        results = []
        for i, event in enumerate(events):
            results.append({
                'event': event,
                'anomaly_score': float(scores[i]),
                'is_anomaly': bool(predictions[i] == -1)  # -1 indicates anomaly
            })
        
        return jsonify({
            'results': results
        })
    
    except Exception as e:
        logger.error(f"Error processing anomaly detection request: {str(e)}")
        return jsonify({
            'error': f'Error processing request: {str(e)}'
        }), 500

@app.route('/train/threat', methods=['POST'])
def train_threat_model():
    """
    Endpoint to train/retrain the threat detection model.
    
    Expected JSON input format:
    {
        "training_data": [
            {
                "event_duration": 120,
                "access_count": 5,
                "time_of_day": 3,
                ...,
                "is_threat": 0
            },
            ...
        ]
    }
    """
    global threat_model
    
    try:
        data = request.get_json()
        
        if not data or 'training_data' not in data:
            return jsonify({
                'error': 'Invalid request format. Expected JSON with "training_data" array.'
            }), 400
        
        training_data = data['training_data']
        df = pd.DataFrame(training_data)
        
        if 'is_threat' not in df.columns:
            return jsonify({
                'error': 'Training data must include "is_threat" column.'
            }), 400
        
        # Split features and target
        X = df.drop('is_threat', axis=1)
        y = df['is_threat']
        
        # Initialize and train the model
        model = ThreatDetectionModel()
        accuracy = model.train(X, y)
        
        # Save the model
        os.makedirs("models", exist_ok=True)
        model.save("models/threat_detection_model.pkl")
        
        # Update the loaded model
        threat_model = model
        
        return jsonify({
            'success': True,
            'training_accuracy': float(accuracy),
            'message': 'Threat detection model trained successfully'
        })
    
    except Exception as e:
        logger.error(f"Error training threat model: {str(e)}")
        return jsonify({
            'error': f'Error training model: {str(e)}'
        }), 500

@app.route('/train/anomaly', methods=['POST'])
def train_anomaly_model():
    """
    Endpoint to train/retrain the anomaly detection model.
    
    Expected JSON input format:
    {
        "training_data": [
            {
                "login_frequency": 10,
                "data_transfer_volume": 500,
                "action_count": 15,
                ...
            },
            ...
        ],
        "model_type": "isolation_forest"  // Optional, default is "isolation_forest"
    }
    """
    global anomaly_model
    
    try:
        data = request.get_json()
        
        if not data or 'training_data' not in data:
            return jsonify({
                'error': 'Invalid request format. Expected JSON with "training_data" array.'
            }), 400
        
        training_data = data['training_data']
        model_type = data.get('model_type', 'isolation_forest')
        
        if model_type not in ['isolation_forest', 'lof']:
            return jsonify({
                'error': 'Invalid model_type. Must be "isolation_forest" or "lof".'
            }), 400
        
        df = pd.DataFrame(training_data)
        
        # Initialize and train the model
        model = AnomalyDetectionModel(model_type=model_type)
        model.train(df)
        
        # Save the model
        os.makedirs("models", exist_ok=True)
        model.save(f"models/anomaly_detection_{model_type}_model.pkl")
        
        # Update the loaded model
        anomaly_model = model
        
        return jsonify({
            'success': True,
            'message': 'Anomaly detection model trained successfully'
        })
    
    except Exception as e:
        logger.error(f"Error training anomaly model: {str(e)}")
        return jsonify({
            'error': f'Error training model: {str(e)}'
        }), 500

if __name__ == "__main__":
    # Create models directory if it doesn't exist
    os.makedirs("models", exist_ok=True)
    
    # Check if models exist, otherwise create sample models
    if not os.path.exists("models/threat_detection_model.pkl"):
        logger.warning("Threat detection model not found. Run model_training.py to create it.")
    
    if not os.path.exists("models/anomaly_detection_isolation_forest_model.pkl"):
        logger.warning("Anomaly detection model not found. Run model_training.py to create it.")
    
    # Run the Flask app
    app.run(host='0.0.0.0', port=5001, debug=True)
