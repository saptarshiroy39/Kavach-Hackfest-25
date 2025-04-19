#!/usr/bin/env python
# -*- coding: utf-8 -*-

"""
Anomaly Detection for Project Hackfest-25

This module implements anomaly detection algorithms for identifying unusual patterns
in security events data.
"""

import numpy as np
import pandas as pd
from sklearn.ensemble import IsolationForest
from sklearn.neighbors import LocalOutlierFactor
from sklearn.preprocessing import StandardScaler
import joblib
import os

class AnomalyDetectionModel:
    """A model for detecting anomalies in security event data."""
    
    def __init__(self, model_type='isolation_forest', model_path=None):
        """
        Initialize the anomaly detection model.
        
        Args:
            model_type (str): Type of anomaly detection model to use ('isolation_forest' or 'lof')
            model_path (str, optional): Path to a saved model file. If None, a new model will be created.
        """
        self.model_type = model_type
        self.features = [
            'login_frequency', 'data_transfer_volume', 'action_count',
            'unusual_hours_activity', 'failed_auth_ratio', 'session_duration',
            'api_call_frequency', 'resource_access_count'
        ]
        
        if model_path and os.path.exists(model_path):
            self.model = joblib.load(model_path)
            self.scaler = joblib.load(f"{os.path.splitext(model_path)[0]}_scaler.pkl")
        else:
            if model_type == 'isolation_forest':
                self.model = IsolationForest(
                    n_estimators=100,
                    contamination=0.05,  # Expected proportion of anomalies
                    random_state=42
                )
            elif model_type == 'lof':
                self.model = LocalOutlierFactor(
                    n_neighbors=20,
                    contamination=0.05,
                    novelty=True  # Enable predict method
                )
            else:
                raise ValueError(f"Unknown model type: {model_type}")
            
            self.scaler = StandardScaler()
    
    def preprocess(self, data):
        """
        Preprocess input data before detection or training.
        
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
    
    def train(self, X):
        """
        Train the anomaly detection model.
        
        Args:
            X (pandas.DataFrame): Training features
        """
        # Fit the scaler and transform training data
        X_scaled = self.scaler.fit_transform(X[self.features].values)
        
        # Train the model
        self.model.fit(X_scaled)
        
        return self.model
    
    def detect(self, data):
        """
        Detect anomalies in the input data.
        
        Args:
            data (pandas.DataFrame): Input data containing feature columns
            
        Returns:
            numpy.ndarray: Anomaly scores for each input record
                          (negative values indicate anomalies for isolation forest,
                           higher values indicate anomalies for LOF)
        """
        X_scaled = self.preprocess(data)
        
        if self.model_type == 'isolation_forest':
            # For Isolation Forest, lower scores (negative) are anomalies
            return self.model.decision_function(X_scaled)
        else:
            # For LOF, higher scores are anomalies
            return -self.model.decision_function(X_scaled)
    
    def classify_anomalies(self, data, threshold=None):
        """
        Classify events as anomalies or normal.
        
        Args:
            data (pandas.DataFrame): Input data containing feature columns
            threshold (float, optional): Score threshold for classification. 
                                         If None, use the model's built-in threshold.
            
        Returns:
            numpy.ndarray: Binary labels (-1 for anomaly, 1 for normal)
        """
        if threshold is None:
            X_scaled = self.preprocess(data)
            return self.model.predict(X_scaled)
        else:
            scores = self.detect(data)
            if self.model_type == 'isolation_forest':
                # For isolation forest, lower scores (negative) are anomalies
                return np.where(scores < threshold, -1, 1)
            else:
                # For LOF, higher scores are anomalies
                return np.where(scores > threshold, -1, 1)
    
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
    print("Initializing anomaly detection model...")
    model = AnomalyDetectionModel(model_type='isolation_forest')
    
    # Example data (would typically come from security logs)
    sample_data = pd.DataFrame({
        'login_frequency': [5, 20, 3, 10],
        'data_transfer_volume': [200, 5000, 150, 300],
        'action_count': [10, 100, 5, 20],
        'unusual_hours_activity': [0, 1, 0, 0],
        'failed_auth_ratio': [0.1, 0.5, 0.05, 0.1],
        'session_duration': [30, 200, 15, 45],
        'api_call_frequency': [50, 500, 20, 100],
        'resource_access_count': [5, 50, 3, 10]
    })
    
    # Train the model
    model.train(sample_data)
    
    # Detect anomalies
    anomaly_scores = model.detect(sample_data)
    print("Anomaly scores:", anomaly_scores)
    
    # Classify records as normal or anomalous
    labels = model.classify_anomalies(sample_data)
    print("Anomaly labels (-1 is anomalous, 1 is normal):", labels)
    
    # Save the model
    model.save("models/anomaly_detection_model.pkl")
