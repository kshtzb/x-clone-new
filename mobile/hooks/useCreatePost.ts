import { use, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Alert } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useApiClient } from "../utils/api";

export const useCreatePost = () => {
  const [content, setContent] = useState("");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const api = useApiClient();
  const queryClient = useQueryClient();

  const createPostMutation = useMutation({
    mutationFn: async (postData: { content: string; imageUri?: string }) => {
      const formData = new FormData();

      if (postData.content) formData.append("content", postData.content);

      if (postData.imageUri) {
        const uriParts = postData.imageUri.split(".");
        const fileType = uriParts[uriParts.length - 1].toLowerCase();

        const mimeTypeMap: Record<string, string> = {
          png: "image/png",
          gif: "image/gif",
          webp: "image/webp",
        };
        const mimeType = mimeTypeMap[fileType] || "image/jpeg";

        formData.append("image", {
          uri: postData.imageUri,
          name: `image.${fileType}`,
          type: mimeType,
        } as any);
      }

      return api.post("/posts", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    },

    onSuccess: () => {
      setContent("");
      setSelectedImage(null);
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      Alert.alert("Success", "Post created successfully!");
    },
    onError: () => {
      Alert.alert("Error", "Failed to create post. Please try again.");
    },
  });

  const handleImagePicker = async (useCamera: boolean = false) => {
    // Request appropriate permission based on source
    const permissionResult = useCamera
      ? await ImagePicker.requestCameraPermissionsAsync() // Camera access
      : await ImagePicker.requestMediaLibraryPermissionsAsync(); // Gallery access

    // Check if permission was granted
    if (permissionResult.status !== "granted") {
      const source = useCamera ? "camera" : "photo library";
      Alert.alert(
        "Permission needed",
        `Please grant permission to access your ${source}`
      );
      return;
    }

    // Configure image picker options
    const pickerOptions = {
      allowsEditing: true, // Allow user to crop/edit image
      aspect: [16, 9] as [number, number], // Fixed aspect ratio (landscape)
      quality: 0.8, // Image quality (0.0 to 1.0)
    };

    const result = useCamera
      ? await ImagePicker.launchCameraAsync(pickerOptions)
      : await ImagePicker.launchImageLibraryAsync({
          ...pickerOptions,
          mediaTypes: ["images"],
        });

    // If user didn't cancel, set the selected image URI
    if (!result.canceled) setSelectedImage(result.assets[0].uri);
  };

  const createPost = () => {
    if (!content.trim() && !selectedImage) {
      Alert.alert(
        "Empty Post",
        "Please write something or add an image before posting!"
      );
      return;
    }

    const postData: { content: string; imageUri?: string } = {
      content: content.trim(),
    };

    if (selectedImage) postData.imageUri = selectedImage;

    createPostMutation.mutate(postData);
  };

  return {
    content,
    setContent,
    selectedImage,
    isCreating: createPostMutation.isPending,
    pickImageFromGallery: () => handleImagePicker(false),
    takePhoto: () => handleImagePicker(true),
    removeImage: () => setSelectedImage(null),
    createPost,
  };
};
