import { View, StyleSheet, Button, Pressable, Text } from "react-native";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import ParallaxScrollView from "@/components/ParallaxScrollView";

import { useLocalSearchParams, useNavigation } from "expo-router";
import { useState } from "react";
import Spinner from "react-native-loading-spinner-overlay";
import { toast } from "sonner-native";

export default function Pay() {
  const { amount, requestID, requestedDate, payeeAddress, reason } =
    useLocalSearchParams();
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  /*const handlePayment = async (
    amount: number,
    receiver: string,
    requestID: string
  ) => {
    try {
      setLoading(true);
      await makePayment(amount, receiver, requestID);
      toast.success("the payment was successful");
    } catch (error) {
      console.log("unable to complete payment:", error);
      toast.error("unable to complete the payment", {
        style: {
          borderColor: "red",
        },
      });
    } finally {
      setLoading(false);
    }
  };
*/
  return (
    <ParallaxScrollView>
      <Spinner visible={loading} />
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Pay Request</ThemedText>
      </ThemedView>
      <View>
        <ThemedText>{payeeAddress}</ThemedText>
        <ThemedText>Reason: {reason}</ThemedText>
        <ThemedText>Amount: {amount}</ThemedText>
      </View>
      <View style={styles.buttons}>
        <Pressable
          style={styles.button}
          onPress={() => {
            navigation.goBack();
          }}
        >
          <Text style={styles.text}>Cancel</Text>
        </Pressable>
        <Pressable style={styles.button} onPress={() => console.log("hi")}>
          <Text style={styles.text}> Pay</Text>
        </Pressable>
      </View>
    </ParallaxScrollView>
  );
}
const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: "row",
    gap: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  buttons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 10,
  },
  button: {
    alignItems: "center",
    justifyContent: "center",

    fontWeight: "semibold",
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 4,
    elevation: 3,
    backgroundColor: "#9EDA6F",
  },
  text: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: "semibold",
    letterSpacing: 0.25,
    color: "black",
  },
});
