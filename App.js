

import React, { useEffect, useState,useContext } from "react";
import { StyleSheet, Text, View, ActivityIndicator,Alert,StatusBar,Dimensions,TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import "react-native-gesture-handler";
import { AuthProvider } from "./AuthContext";
import { AuthContext } from "./AuthContext";
import Navigation from "./Navigation";
import * as Font from "expo-font";
import * as Notifications from "expo-notifications";
import * as SecureStore from "expo-secure-store";

export default function App() {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  // const [notificationData, setNotificationData] = useState(null)
  
  const [notificationData, setNotificationData] = useState(
    {
      title:'Hola',
      body:'Prueba de notificacion'
  });
  useEffect(() => {
    
    const loadFonts = async () => {
      try {
        // Cargar fuentes personalizadas
        await Font.loadAsync({
   
          SenRegular: require("./assets/fonts/Gwendolyn-Regular.ttf"),
          SenBold: require("./assets/fonts/Gwendolyn-Bold.ttf"),
          bodyRegular: require("./assets/fonts/Charm-Regular.ttf"),
          bodyBold: require("./assets/fonts/Charm-Bold.ttf"),
        });

        setFontsLoaded(true);
        const { status } = await Notifications.requestPermissionsAsync();
        
        await SecureStore.setItemAsync("notificationPermission", status);
      } catch (error) {
        
        Alert.alert(`Error cargando las fuentes: ${error.message}`);
      }
    };

    loadFonts();
  }, []);

  // useEffect(() => {
  //   const handleNotificationReceived = (notification) => {
      
  //     Alert.alert(notification.request.content.title, notification.request.content.body);
      
  //   };

  //   // Escuchar notificaciones recibidas mientras la app está en primer plano
  //   const subscription = Notifications.addNotificationReceivedListener(handleNotificationReceived);

  //   // Limpiar el listener al desmontar el componente
  //   return () => {
  //     subscription.remove();
  //   };
  // }, []);
  useEffect(() => {
    const handleNotificationReceived = (notification) => {
      const { title, body } = notification.request.content;
      setNotificationData({ title, body });
    };

    const subscription = Notifications.addNotificationReceivedListener(
      handleNotificationReceived
    );

    return () => subscription.remove();
  }, []);

  if (!fontsLoaded) {
    return (
      <View style={[styles.loadingContainer,{backgroundColor:'#fecdd3'}]}>
        <ActivityIndicator size="large" color="#ffffff" />
        <Text style={styles.loadingText}>Cargando fuentes...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        backgroundColor="#fb7185"
        barStyle="light-content"
      />
      <AuthProvider>
        
        <Navigation notificationData={notificationData} setNotificationData={setNotificationData} ></Navigation>
      </AuthProvider>

      {/* {notificationData && (
        <View style={styles.overlay}>
          <View style={styles.alertBox}>
            <Text style={styles.alertTitle}>{notificationData.title}</Text>
            <Text style={styles.alertBody}>{notificationData.body}</Text>
            <TouchableOpacity
              style={styles.alertButton}
              onPress={() => setNotificationData(null)}
            >
              <Text style={styles.alertButtonText}>Aceptar</Text>
            </TouchableOpacity>
          </View>
        </View>
        
      )} */}
    </SafeAreaView>
  );
}
const { width } = Dimensions.get("window");
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgba(28, 44, 52, 0.9)",
    
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    // backgroundColor: "rgba(28, 44, 52, 0.9)",
  },
  loadingText: {
    color: "black",
    fontSize: 18,
    marginTop: 10,
  },
  
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 999,
  },
  alertBox: {
    width: width * 0.8,
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
    elevation: 5,
  },
  alertTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  alertBody: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: "center",
  },
  alertButton: {
    backgroundColor: "#fb7185",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  alertButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});
