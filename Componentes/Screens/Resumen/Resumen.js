import React, {useState,useEffect, useContext} from "react";
import { View, Text, StyleSheet, ImageBackground, TouchableOpacity,Keyboard,Linking,Alert  } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useTheme } from '@react-navigation/native';
import { AuthContext } from "../../../AuthContext";
import LottieView from 'lottie-react-native';
import Generarpeticion from "../../../Apis/peticiones";
export default function Resumen({ navigation  }){
    const { colors,fonts } = useTheme();
    const { estadocomponente } = useContext(AuthContext);
    const {  recargar_componentes } = useContext(AuthContext);
    const {  actualizarEstadocomponente } = useContext(AuthContext);
    const { activarsesion, setActivarsesion } = useContext(AuthContext);
    return(
        <View style={{flex: 1,}}>
            <View style={{flex: 1,alignContent:'center',alignItems:'center',justifyContent:'center'}}>
                <Text style={{ fontFamily: fonts.regularbold.fontFamily,fontSize:30 }}>Opción en desarrollo..😊🙌  </Text>
                <LottieView
                    source={require('../../../assets/inprogres.json')}
                    style={{ width: 300, height: 300 }}
                    autoPlay
                    loop
                />
            </View>
        </View>
    )
}
