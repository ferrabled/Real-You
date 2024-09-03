// components/ImageCard.tsx

import React from 'react';
import { View, Image, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ImageCardProps } from '../types';


const ImageCard: React.FC<ImageCardProps> = ({ imageUrl, description, username, timestamp, isVerified }) => {
    return (
        <View style={styles.container}>
            <Image source={{ uri: imageUrl }} style={styles.image} />
            <View style={styles.infoContainer}>
                <View style={styles.userInfo}>
                    <Text style={styles.username}>{username}</Text>
                    {isVerified && (
                        <TouchableOpacity style={styles.verificationBadge}>
                            <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
                        </TouchableOpacity>
                    )}
                </View>
                <Text style={styles.timestamp}>{timestamp}</Text>
                <Text style={styles.description}>{description}</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        borderRadius: 10,
        marginBottom: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    image: {
        width: '100%',
        height: 300,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
    },
    infoContainer: {
        padding: 15,
    },
    userInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 5,
    },
    username: {
        fontWeight: 'bold',
        fontSize: 16,
        marginRight: 5,
    },
    verificationBadge: {
        marginLeft: 5,
    },
    timestamp: {
        color: '#888',
        fontSize: 12,
        marginBottom: 8,
    },
    description: {
        fontSize: 14,
    },
});

export default ImageCard;