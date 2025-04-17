import React, {useState,useEffect, useContext} from "react";
import {  View,Share,StyleSheet,TouchableOpacity,Text,Alert  } from 'react-native';
import { useNavigation } from "@react-navigation/native";
import { useTheme } from '@react-navigation/native';

import Generarpeticion from '../../../Apis/peticiones';
import Handelstorage from '../../../Storage/handelstorage';
import { AuthContext } from '../../../AuthContext';
import AntDesign from '@expo/vector-icons/AntDesign';
function Compartir ({navigation}) {
  const { colors,fonts } = useTheme();
  const { navigate } = useNavigation();
  const { activarsesion, setActivarsesion } = useContext(AuthContext);
  const [datasistema,setDatasistema]=useState([])
  const [enlaceDescarga,setEnlaceDescarga]=useState('')
  const {  actualizarEstadocomponente } = useContext(AuthContext);
  const { estadocomponente } = useContext(AuthContext);
  const [cargalista,setCarlista]=useState(false)
  const [usuariocomparte,setUsuariocomparte]=useState('')
  
  //const enlaceDescarga = 'https://drive.google.com/file/d/17hbIKWC-RgszyVKprq_4zwChygDYsJiO/view?usp=sharing'; // Reemplaza con tu enlace de descarga

  const compartirEnlace = async () => {
    try {
      const mensaje = `¡Descarga WomenApp!🤗 ${enlaceDescarga} , enlace enviado por el usuario ${usuariocomparte}`;

      const result = await Share.share({
        message: mensaje, // El mensaje que se compartirá
        title: 'Compartir enlace de descarga', // Título del diálogo de compartir
      });
      
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // El usuario compartió a través de una aplicación específica (por ejemplo, WhatsApp)
          
          Alert.alert('Compartido a través de:', result.activityType)
        } else {
          // El usuario compartió, pero no se seleccionó una aplicación específica
          Alert.alert('Enlace compartido');
        }
      } else if (result.action === Share.dismissedAction) {
        // El usuario canceló el diálogo de compartir
        Alert.alert('Compartir cancelado');
      }
    } catch (error) {
      Alert.alert('Error al compartir:', error);
    }
  };

  useEffect(() => {
      
      

    const unsubscribe = navigation.addListener('focus', () => {
    
      
      const cargardatos=async()=>{
        actualizarEstadocomponente('tituloloading','Obteniendo datos del Sistema..')
        actualizarEstadocomponente('loading',true)
        const datosstarage = await Handelstorage('obtener');
        setUsuariocomparte(datosstarage.user_name)
        const body = {};
        const endpoint='DatosSistema/'
        const result = await Generarpeticion(endpoint, 'POST', body);
        const respuesta=result['resp']
        actualizarEstadocomponente('tituloloading','')
        actualizarEstadocomponente('loading',false)
        
        if (respuesta === 200){
            const registros=result['data']
            
            setEnlaceDescarga(registros[0]['link_descarga'])
            setDatasistema(registros[0])
            setCarlista(true)
            
            
            
        }else if(respuesta === 403 || respuesta === 401){
        
           
            
            await Handelstorage('borrar')
            await new Promise(resolve => setTimeout(resolve, 1000))
            setActivarsesion(false)
        }else{
        // showDialog(true)
        // setMensajeerror( handleError(result['data']['error']))
        Alert.alert(result['data']['error'])
        }
              

     
          
          

       

         
      }
      
      cargardatos()
      
    })
    return unsubscribe;
  

    }, [navigation]);

  return (
    <View style={styles.container}>
      <View style={{padding:10}}>

            <Text style={[styles.encabezado,{fontFamily: fonts.regularbold.fontFamily}]}>Comparte la aplicacion!!</Text>
            <Text style={[styles.contenido,{fontFamily: fonts.bodyregular.fontFamily}]}>✅ Dale al boton compartir y envia el enlace de descarga a tus contactos.</Text>
            {
                cargalista &&(
                    <>
                        <Text style={[styles.contenido,{fontFamily: fonts.bodyregular.fontFamily}]}>✅ Version Descarga : {datasistema.version}</Text>
                        <Text style={[styles.contenido,{fontFamily: fonts.bodyregular.fontFamily}]}>✅ Fecha Actualizacion : {datasistema.fecha_creacion}</Text>
                        <Text style={[styles.contenido,{fontFamily: fonts.bodyregular.fontFamily}]}>✅ Enlace descarga : {datasistema.link_descarga}</Text>
                    </>
                )
            }
            <TouchableOpacity
                style={{ 
                    backgroundColor: colors.BotonActive, // Cambia el color si está deshabilitado
                    marginTop: 20,
                    marginBottom: 10,
                    height: 50,
                    justifyContent: 'center', 
                    alignItems: 'center', 
                    borderRadius: 20,
                    flexDirection: 'row', // Alinea los elementos en fila
                    paddingHorizontal: 10, // Espaciado interno
                    
                }} 
                
                onPress={compartirEnlace}
                
                >
                    <Text style={{fontSize: 18,color: colors.BotonTextActive,fontFamily: fonts.bodybold.fontFamily, marginRight: 8,}}>
                    Compartir
                    </Text>
                    <AntDesign name="sharealt" size={24} color={colors.BotonTextActive} />
            </TouchableOpacity>
      </View>

        
    </View>
  );
};
const styles = StyleSheet.create({
    container: {
      flex: 1,
      
    },
    encabezado:{
      fontSize: 30,
      color: 'black',
      marginBottom:5,
      marginLeft:'15%'
    },
    contenido:{
      marginBottom:10,
      fontSize:17
    }
  });

export default Compartir;