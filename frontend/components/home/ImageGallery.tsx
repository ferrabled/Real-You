import React, { useEffect, useState, useContext } from "react";
import { View, StyleSheet, ScrollView, Dimensions } from "react-native";
import { ethers } from "ethers";
import { Web3AuthContext } from "@/context/Web3AuthContext";
import {
  REALYOU_CONTRACT_ABI,
  REALYOU_CONTRACT_ADDRESS,
} from "@/constants/RealYouContract";
import ImageCard from "./ImageCard";
import { ThemedText } from "../ThemedText";
import VerificationBadge from "./VerificationBadge";
import { IndexService } from "@ethsign/sp-sdk";

const { width } = Dimensions.get("window");
const PADDING = 10;

interface Photo {
  id: string;
  ipfsHash: string;
  owner: string;
  username: string;
  timestamp: number;
  isVerified: boolean;
  attestationLink: string | null;
}

export const ImageGallery: React.FC = () => {
  const { provider } = useContext(Web3AuthContext);
  const [photos, setPhotos] = useState<Photo[]>([]);

  useEffect(() => {
    if (provider) {
      fetchPhotos();
    }
  }, [provider]);

  const fetchPhotos = async () => {
    try {
      const ethersProvider = new ethers.BrowserProvider(provider);
      const signer = await ethersProvider.getSigner();
      const contract = new ethers.Contract(
        REALYOU_CONTRACT_ADDRESS,
        REALYOU_CONTRACT_ABI,
        signer
      );

      const photoCount = await contract.photoCount();
      const fetchedPhotos = await contract.getAllPhotos(1, photoCount);

      const indexService = new IndexService("testnet");
      const res = await indexService.queryAttestationList({
        schemaId: "onchain_evm_11155111_0x82",
        attester: "0x66E30Ce4FB76f08C431080B1C1C95d97311a4526",
        page: 1,
        mode: "onchain",
      });

      const formattedPhotos = await Promise.all(
        fetchedPhotos.map(async (photo: any, index: number) => {
          const userProfile = await contract.getUserProfile(photo[0]);
          console.log("userProfile", userProfile);
          let ipfsHash = photo[1];
          let isVerified = false;
          let attestationLink = null;

          if (res && res.rows) {
            for (const att of res.rows) {
              let parsedData: any = {};
              if (att.mode === "onchain") {
                try {
                  const hexString: string = att.data.startsWith("0x")
                    ? att.data.slice(2)
                    : att.data;
                  const [photoHash, photoId, isVerified] =
                    ethers.AbiCoder.defaultAbiCoder().decode(
                      ["string", "uint256", "bool"],
                      `0x${hexString}`
                    );

                  parsedData = {
                    PhotoHash: photoHash,
                    PhotoId: photoId.toString(),
                    IsVerified: isVerified,
                  };
                } catch (error) {
                  console.error(
                    "Error decoding on-chain attestation data:",
                    error
                  );
                }
              }
              console.log("Parsed attestation data:", parsedData);

              if (parsedData.PhotoHash === ipfsHash) {
                isVerified = parsedData.IsVerified;
                attestationLink = `https://testnet-scan.sign.global/attestation/onchain_evm_11155111_${att.attestationId}`;
                ipfsHash = parsedData.PhotoHash;
                break;
              } else {
                console.log("TEST del pareja");
                console.log("ipfsHash", ipfsHash);
                console.log("parsedData.PhotoId", parsedData.PhotoId);
                console.log("No matching attestation found");
              }
            }
          }
          return {
            id: index.toString(),
            owner: photo[0],
            ipfsHash,
            timestamp: Number(photo[2]),
            username: userProfile.username || "Unknown User",
            isVerified,
            attestationLink,
          };
        })
      );

      const sortedPhotos = formattedPhotos.sort(
        (a, b) => b.timestamp - a.timestamp
      );

      setPhotos(sortedPhotos);
    } catch (error) {
      console.error("Error fetching photos:", error);
    }
  };

  if (photos.length === 0) {
    return (
      <View style={styles.emptyStateContainer}>
        <ThemedText style={styles.emptyStateText}>
          No photos have been shared yet.
        </ThemedText>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.gallery}>
        {photos.map((photo) => (
          <View key={photo.id} style={styles.imageContainer}>
            <ImageCard
              key={photo.id}
              imageUrl={`https://ipfs.io/ipfs/${photo.ipfsHash}`}
              username={photo.username}
              timestamp={new Date(photo.timestamp * 1000).toLocaleString()}
            />
            <VerificationBadge
              isVerified={photo.isVerified}
              attestationLink={photo.attestationLink}
            />
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingTop: 20,
    paddingHorizontal: PADDING,
  },
  gallery: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  emptyStateContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  emptyStateText: {
    fontSize: 18,
    textAlign: "center",
  },
  imageContainer: {
    position: "relative",
  },
});

export default ImageGallery;
