import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Image,
  Dimensions,
  ScrollView,
  NativeSyntheticEvent,
  NativeScrollEvent,
  ImageSourcePropType,
} from "react-native";
import { useRouter } from "expo-router";

interface Slide {
  image: ImageSourcePropType;
  text: string;
}

// Define images object
const images = {
  fingerprint: require("../../../assets/images/fingerp.png"),
  keyp: require("../../../assets/images/keyp.png"),
  faster: require("../../../assets/images/fasterp.png"),
  logo: require("../../../assets/images/ninepay.png"),
};
const { width } = Dimensions.get("window");

const Home = () => {
  const router = useRouter();
  const [currentSlide, setCurrentSlide] = useState<number>(0);
  const scrollViewRef = useRef<ScrollView | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const slides = [
    {
      image: images.fingerprint,
      text: "",
    },
    {
      image: images.keyp,
      text: "",
    },
    {
      image: images.faster,
      text: "",
    },
  ];

  const startAutoSlide = (): void => {
    intervalRef.current = setInterval(() => {
      const nextSlide: number =
        currentSlide === slides.length - 1 ? 0 : currentSlide + 1;
      setCurrentSlide(nextSlide);
      scrollViewRef.current?.scrollTo({ x: nextSlide * width, animated: true });
    }, 1700);
  };

  useEffect(() => {
    startAutoSlide();
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [currentSlide]);

  const handleScroll = (
    event: NativeSyntheticEvent<NativeScrollEvent>
  ): void => {
    const slideIndex = Math.floor(event.nativeEvent.contentOffset.x / width);
    setCurrentSlide(slideIndex);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    startAutoSlide();
  };
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image
          source={images.logo}
          style={styles.logo}
          // Add error handling
          onError={(e) =>
            console.error("Image loading error:", e.nativeEvent.error)
          }
        />
        <Text style={styles.bannerText}>Aptos Payments Made Easy.</Text>
      </View>

      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        {slides.map((slide, index) => (
          <View style={styles.slide} key={index}>
            <Image
              source={slide.image}
              style={styles.image}
              // Add error handling
              onError={(e) =>
                console.error("Slide image loading error:", e.nativeEvent.error)
              }
            />
            <Text style={styles.description}>{slide.text}</Text>
          </View>
        ))}
      </ScrollView>

      <Pressable
        style={({ pressed }: { pressed: boolean }) => [
          styles.button,
          { opacity: pressed ? 0.7 : 1 },
        ]}
        onPress={() => router.push("/login")}
      >
        <Text style={styles.buttonText}>Get Started</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0d0d0d",
  },
  header: {
    alignItems: "center",
    marginTop: 100,
    marginBottom: 0,
  },
  logo: {
    width: 500,
    height: 100,
    resizeMode: "contain",
    marginBottom: 10,
  },
  bannerText: {
    color: "#fff",
    fontSize: 16,
    textAlign: "center",
  },
  slide: {
    width: width,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: "100%",
    height: 300,
    resizeMode: "cover",
  },
  description: {
    fontSize: 18,
    textAlign: "center",
    marginTop: 20,
    paddingHorizontal: 10,
    color: "#fff",
  },
  button: {
    backgroundColor: "#9EDA6F",
    position: "absolute",
    bottom: 20,
    left: 0,
    right: 0,
    paddingVertical: 10,
    borderRadius: 12,
    marginHorizontal: 10,
  },
  buttonText: {
    color: "#000000",
    fontSize: 19,
    fontWeight: "600",
    textAlign: "center",
  },
});

export default Home;
