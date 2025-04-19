#!/usr/bin/env python
# -*- coding: utf-8 -*-

"""
Model Training Script for Project Hackfest-25

This script handles the training and evaluation of security AI models
using historical security event data.
"""

import os
import argparse
import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report, roc_auc_score, confusion_matrix

from threat_detection import ThreatDetectionModel
from anomaly_detection import AnomalyDetectionModel

# Create models directory if it doesn't exist
os.makedirs("models", exist_ok=True)

def load_data(data_path):
    """
    Load and preprocess the security event data for model training.
    
    Args:
        data_path (str): Path to the CSV file containing training data
        
    Returns:
        pandas.DataFrame: Processed data ready for training
    """
    print(f"Loading data from {data_path}...")
    
    if not os.path.exists(data_path):
        raise FileNotFoundError(f"Data file not found: {data_path}")
    
    data = pd.read_csv(data_path)
    
    # Basic preprocessing
    data = data.dropna()  # Remove rows with missing values
    
    print(f"Loaded {len(data)} records from {data_path}")
    return data

def train_threat_model(data_path, test_size=0.2, random_state=42):
    """
    Train and evaluate a threat detection model.
    
    Args:
        data_path (str): Path to the training data
        test_size (float): Proportion of data to use for testing
        random_state (int): Random seed for reproducibility
        
    Returns:
        ThreatDetectionModel: Trained model
    """
    print("\n=== Training Threat Detection Model ===")
    
    # Load data
    data = load_data(data_path)
    
    # Ensure data has necessary columns
    required_columns = [
        'event_duration', 'access_count', 'time_of_day', 'failed_attempts',
        'unusual_ip', 'unusual_location', 'unusual_device', 'sensitive_data_access',
        'is_threat'  # Target variable
    ]
    
    missing_columns = [col for col in required_columns if col not in data.columns]
    if missing_columns:
        raise ValueError(f"Data is missing required columns: {missing_columns}")
    
    # Split features and target
    X = data.drop('is_threat', axis=1)
    y = data['is_threat']
    
    # Split data into train and test sets
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=test_size, random_state=random_state, stratify=y
    )
    
    print(f"Training data shape: {X_train.shape}, Test data shape: {X_test.shape}")
    
    # Initialize and train the model
    model = ThreatDetectionModel()
    train_accuracy = model.train(X_train, y_train)
    
    print(f"Training accuracy: {train_accuracy:.4f}")
    
    # Evaluate the model
    y_pred_proba = model.predict(X_test)
    y_pred = model.classify(X_test)
    
    # Calculate metrics
    test_accuracy = (y_pred == y_test).mean()
    auc = roc_auc_score(y_test, y_pred_proba)
    
    print(f"Test accuracy: {test_accuracy:.4f}")
    print(f"ROC AUC Score: {auc:.4f}")
    
    # Print classification report
    print("\nClassification Report:")
    print(classification_report(y_test, y_pred))
    
    # Print confusion matrix
    conf_matrix = confusion_matrix(y_test, y_pred)
    print("\nConfusion Matrix:")
    print(conf_matrix)
    
    # Save the model
    model_path = "models/threat_detection_model.pkl"
    model.save(model_path)
    
    return model

def train_anomaly_model(data_path, model_type='isolation_forest'):
    """
    Train and evaluate an anomaly detection model.
    
    Args:
        data_path (str): Path to the training data
        model_type (str): Type of anomaly detection model to use
        
    Returns:
        AnomalyDetectionModel: Trained model
    """
    print("\n=== Training Anomaly Detection Model ===")
    
    # Load data
    data = load_data(data_path)
    
    # For anomaly detection, we typically train on normal data only
    if 'is_anomaly' in data.columns:
        normal_data = data[data['is_anomaly'] == 0]
        anomaly_data = data[data['is_anomaly'] == 1]
        print(f"Normal data: {len(normal_data)} records, Anomalies: {len(anomaly_data)} records")
        
        # Train on normal data only
        train_data = normal_data.drop('is_anomaly', axis=1)
    else:
        print("No 'is_anomaly' column found. Training on all data as normal.")
        train_data = data
    
    # Initialize and train the model
    model = AnomalyDetectionModel(model_type=model_type)
    model.train(train_data)
    
    # If we have labeled anomalies, evaluate the model
    if 'is_anomaly' in data.columns:
        # Combine normal and anomaly data for testing
        test_data = pd.concat([normal_data, anomaly_data]).drop('is_anomaly', axis=1)
        true_labels = np.concatenate([
            np.ones(len(normal_data)),  # 1 for normal
            -np.ones(len(anomaly_data))  # -1 for anomalies
        ])
        
        # Detect anomalies
        pred_labels = model.classify_anomalies(test_data)
        
        # Calculate accuracy
        accuracy = (pred_labels == true_labels).mean()
        print(f"Anomaly detection accuracy: {accuracy:.4f}")
        
        # Print classification report
        print("\nClassification Report:")
        print(classification_report(true_labels, pred_labels, labels=[-1, 1], target_names=['Anomaly', 'Normal']))
        
        # Print confusion matrix
        conf_matrix = confusion_matrix(true_labels, pred_labels)
        print("\nConfusion Matrix:")
        print(conf_matrix)
    
    # Save the model
    model_path = f"models/anomaly_detection_{model_type}_model.pkl"
    model.save(model_path)
    
    return model

def main():
    parser = argparse.ArgumentParser(description='Train security AI models')
    parser.add_argument('--threat_data', required=False, default='data/threat_data.csv',
                        help='Path to threat detection training data')
    parser.add_argument('--anomaly_data', required=False, default='data/anomaly_data.csv',
                        help='Path to anomaly detection training data')
    parser.add_argument('--anomaly_model', choices=['isolation_forest', 'lof'], 
                        default='isolation_forest',
                        help='Type of anomaly detection model to train')
    parser.add_argument('--test_size', type=float, default=0.2,
                        help='Proportion of data to use for testing')
    parser.add_argument('--random_state', type=int, default=42,
                        help='Random seed for reproducibility')
    
    args = parser.parse_args()
    
    # Create data directory if it doesn't exist
    os.makedirs("data", exist_ok=True)
    
    # Generate sample data if not available
    if not os.path.exists(args.threat_data):
        print(f"Warning: {args.threat_data} not found. Creating sample data for demonstration.")
        create_sample_threat_data(args.threat_data)
    
    if not os.path.exists(args.anomaly_data):
        print(f"Warning: {args.anomaly_data} not found. Creating sample data for demonstration.")
        create_sample_anomaly_data(args.anomaly_data)
    
    # Train models
    threat_model = train_threat_model(
        args.threat_data, test_size=args.test_size, random_state=args.random_state
    )
    
    anomaly_model = train_anomaly_model(
        args.anomaly_data, model_type=args.anomaly_model
    )
    
    print("\nModel training complete. Models saved in the 'models' directory.")

def create_sample_threat_data(output_path):
    """Create sample threat detection data for demonstration purposes."""
    np.random.seed(42)
    n_samples = 1000
    
    # Generate normal data (70% of samples)
    n_normal = int(0.7 * n_samples)
    normal_data = pd.DataFrame({
        'event_duration': np.random.gamma(2, 10, n_normal),
        'access_count': np.random.poisson(3, n_normal),
        'time_of_day': np.random.randint(7, 19, n_normal),  # Business hours
        'failed_attempts': np.random.binomial(3, 0.1, n_normal),
        'unusual_ip': np.zeros(n_normal),
        'unusual_location': np.zeros(n_normal),
        'unusual_device': np.random.binomial(1, 0.05, n_normal),
        'sensitive_data_access': np.random.binomial(1, 0.1, n_normal),
        'is_threat': np.zeros(n_normal)
    })
    
    # Generate threat data (30% of samples)
    n_threat = n_samples - n_normal
    threat_data = pd.DataFrame({
        'event_duration': np.random.gamma(1, 30, n_threat),
        'access_count': np.random.poisson(20, n_threat),
        'time_of_day': np.random.choice([0, 1, 2, 3, 4, 5, 6, 20, 21, 22, 23], n_threat),  # Non-business hours
        'failed_attempts': np.random.poisson(3, n_threat),
        'unusual_ip': np.random.binomial(1, 0.8, n_threat),
        'unusual_location': np.random.binomial(1, 0.7, n_threat),
        'unusual_device': np.random.binomial(1, 0.6, n_threat),
        'sensitive_data_access': np.random.binomial(1, 0.9, n_threat),
        'is_threat': np.ones(n_threat)
    })
    
    # Combine and shuffle data
    data = pd.concat([normal_data, threat_data]).sample(frac=1).reset_index(drop=True)
    
    # Save to CSV
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    data.to_csv(output_path, index=False)
    print(f"Sample threat data created at {output_path}")

def create_sample_anomaly_data(output_path):
    """Create sample anomaly detection data for demonstration purposes."""
    np.random.seed(42)
    n_samples = 1000
    
    # Generate normal data (90% of samples)
    n_normal = int(0.9 * n_samples)
    normal_data = pd.DataFrame({
        'login_frequency': np.random.poisson(10, n_normal),
        'data_transfer_volume': np.random.gamma(5, 50, n_normal),
        'action_count': np.random.poisson(15, n_normal),
        'unusual_hours_activity': np.random.binomial(1, 0.1, n_normal),
        'failed_auth_ratio': np.random.beta(1, 20, n_normal),
        'session_duration': np.random.gamma(3, 15, n_normal),
        'api_call_frequency': np.random.poisson(30, n_normal),
        'resource_access_count': np.random.poisson(8, n_normal),
        'is_anomaly': np.zeros(n_normal)
    })
    
    # Generate anomaly data (10% of samples)
    n_anomaly = n_samples - n_normal
    anomaly_data = pd.DataFrame({
        'login_frequency': np.random.poisson(50, n_anomaly),
        'data_transfer_volume': np.random.gamma(10, 200, n_anomaly),
        'action_count': np.random.poisson(100, n_anomaly),
        'unusual_hours_activity': np.random.binomial(1, 0.9, n_anomaly),
        'failed_auth_ratio': np.random.beta(5, 5, n_anomaly),
        'session_duration': np.random.gamma(1, 60, n_anomaly),
        'api_call_frequency': np.random.poisson(300, n_anomaly),
        'resource_access_count': np.random.poisson(50, n_anomaly),
        'is_anomaly': np.ones(n_anomaly)
    })
    
    # Combine and shuffle data
    data = pd.concat([normal_data, anomaly_data]).sample(frac=1).reset_index(drop=True)
    
    # Save to CSV
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    data.to_csv(output_path, index=False)
    print(f"Sample anomaly data created at {output_path}")

if __name__ == "__main__":
    main()
