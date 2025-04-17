import React from 'react';
import { View, StyleSheet, Text,TouchableOpacity,Dimensions } from 'react-native';
import { useTheme } from '@react-navigation/native';



function Notificaciones({ notificationData,setNotificationData,navigation }) {

  const { colors, fonts } = useTheme();
    return (
        <View style={styles.overlay}>
                  <View style={[styles.alertBox,{backgroundColor:colors.backgroundnotificacion}]}>
                    <Text style={[styles.alertTitle,{fontFamily: fonts.bodybold.fontFamily}]}>{notificationData.title}</Text>
                    <Text style={[styles.alertBody,{fontFamily: fonts.bodyregular.fontFamily}]}>{notificationData.body}</Text>
                    <TouchableOpacity
                    //   style={[styles.alertButton]}
                    style={{ 
                          
                        backgroundColor:  colors.BotonActive, 
                        height: 40,
                        justifyContent: 'center', 
                        alignItems: 'center', 
                        borderRadius: 20,
                        width:'45%',
                        marginTop:10,
                        marginBottom:10
                      }}
                      onPress={() => setNotificationData(null)}
                    >
                      <Text 
                    //   style={[styles.alertButtonText,{fontFamily: fonts.bodybold.fontFamily}]}
                    style={{
                        fontSize: 20,
                        color: colors.BotonTextActive, 
                        fontFamily: fonts.bodybold.fontFamily,
                        marginTop:-5
                        
                      }}
                      >
                        Aceptar</Text>
                    </TouchableOpacity>
                  </View>
                </View>
    );
}
const { width } = Dimensions.get("window");
const styles = StyleSheet.create({
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
        // backgroundColor: "white",
        borderRadius: 10,
        paddingTop: 5,
        paddingBottom: 5,
        paddingLeft:20,
        paddingRight:20,
        alignItems: "center",
        elevation: 5,
      },
      alertTitle: {
        fontSize: 25,
        
        marginBottom: -15,
        textAlign: "center",
      },
      alertBody: {
        fontSize: 18,
        marginBottom: 1,
        textAlign: "center",
      },
    //   alertButton: {
    //     backgroundColor: "#fb7185",
    //     paddingVertical: 10,
    //     paddingHorizontal: 20,
    //     borderRadius: 8,
    //   },
    //   alertButtonText: {
    //     color: "white",
    //     fontSize: 16,
        
    //   },
});

export default Notificaciones;
