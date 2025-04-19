#!/usr/bin/env python
# -*- coding: utf-8 -*-

"""
Threat Detection Model for Project Hackfest-25

This module implements machine learning models for detecting security threats
based on input features from security logs and events.
"""

import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import StandardScaler
import joblib
import os

class ThreatDetectionModel:
    """A model for detecting potential security threats based on event features."""
    
    def __init__(self, model_path=None):
        """
        Initialize the threat detection model.
        
        Args:
            model_path (str, optional): Path to a saved model file. If None, 
                                        a new model will be created.
        """
        self.features = [
            'event_duration', 'access_count', 'time_of_day', 
            'failed_attempts', 'unusual_ip', 'unusual_location',
            'unusual_device', 'sensitive_data_access'
        ]
        
        if model_path and os.path.exists(model_path):
            self.model = joblib.load(model_path)
            self.scaler = joblib.load(f"{os.path.splitext(model_path)[0]}_scaler.pkl")
        else:
            self.model = RandomForestClassifier(
                n_estimators=100,
                max_depth=10,
                random_state=42
            )
            self.scaler = StandardScaler()
    
    def preprocess(self, data):
        """
        Preprocess input data before prediction or training.
        
        Args:
            data (pandas.DataFrame): Input data containing feature columns
            
        Returns:
            numpy.ndarray: Preprocessed feature matrix
        """
        # Ensure all required features are present
        for feature in self.features:
            if feature not in data.columns:
                data[feature] = 0
        
        # Extract features in the correct order
        X = data[self.features].values
        
        # Scale features
        return self.scaler.transform(X)
    
    def train(self, X, y):
        """
        Train the threat detection model.
        
        Args:
            X (pandas.DataFrame): Training features
            y (pandas.Series or numpy.ndarray): Target labels (1 for threat, 0 for normal)
        
        Returns:
            float: Training accuracy
        """
        # Fit the scaler and transform training data
        X_scaled = self.scaler.fit_transform(X[self.features].values)
        
        # Train the model
        self.model.fit(X_scaled, y)
        
        # Return training accuracy
        return self.model.score(X_scaled, y)
    
    def predict(self, data):
        """
        Predict threat probability for input events.
        
        Args:
            data (pandas.DataFrame): Input data containing feature columns
            
        Returns:
            numpy.ndarray: Probabilities of being a threat (between 0 and 1)
        """
        X_scaled = self.preprocess(data)
        return self.model.predict_proba(X_scaled)[:, 1]
    
    def classify(self, data, threshold=0.7):
        """
        Classify events as threats or normal based on a threshold.
        
        Args:
            data (pandas.DataFrame): Input data containing feature columns
            threshold (float, optional): Probability threshold for classification
            
        Returns:
            numpy.ndarray: Binary labels (1 for threat, 0 for normal)
        """
        probs = self.predict(data)
        return (probs >= threshold).astype(int)
    
    def save(self, model_path):
        """
        Save the trained model to a file.
        
        Args:
            model_path (str): Path where the model will be saved
        """
        joblib.dump(self.model, model_path)
        scaler_path = f"{os.path.splitext(model_path)[0]}_scaler.pkl"
        joblib.dump(self.scaler, scaler_path)
        print(f"Model saved to {model_path} and scaler to {scaler_path}")


if __name__ == "__main__":
    # Example usage
    print("Initializing threat detection model...")
    model = ThreatDetectionModel()
    
    # Example data (would typically come from security logs)
    sample_data = pd.DataFrame({
        'event_duration': [120, 5, 300, 10],
        'access_count': [2, 50, 5, 1],
        'time_of_day': [3, 14, 23, 12],  # 24-hour format
        'failed_attempts': [0, 5, 1, 0],
        'unusual_ip': [0, 1, 1, 0],
        'unusual_location': [0, 1, 1, 0],
        'unusual_device': [0, 1, 0, 0],
        'sensitive_data_access': [0, 1, 1, 0]
    })
    
    # Fake labels for demonstration
    labels = np.array([0, 1, 1, 0])
    
    # Train the model
    accuracy = model.train(sample_data, labels)
    print(f"Training accuracy: {accuracy:.2f}")
    
    # Predict on new data
    pred_probs = model.predict(sample_data)
    print("Prediction probabilities:", pred_probs)
    
    # Save the model
    model.save("models/threat_detection_model.pkl")
