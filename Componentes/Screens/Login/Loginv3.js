import React, {useState,useEffect, useContext} from "react";
import { View, Text, StyleSheet, ImageBackground, TouchableOpacity,Keyboard,Linking,Alert  } from "react-native";
import { Button, TextInput,Dialog, Portal,PaperProvider,DefaultTheme as PaperDefaultTheme  } from 'react-native-paper';
import { useNavigation } from "@react-navigation/native";
import * as Notifications from 'expo-notifications';
import LottieView from 'lottie-react-native';
import Handelstorage from "../../../Storage/handelstorage"
import ComprobarStorage from "../../../Storage/verificarstorage"
import Iniciarsesion from "../../../Apis/apiiniciosesion";
import Comprobarsesion from "../../../Apis/apicomprobarsesion";
import Generarpeticion from "../../../Apis/peticiones";
import * as SecureStore from "expo-secure-store";

import { AuthContext } from "../../../AuthContext";
import { useTheme ,DefaultTheme as NavigationDefaultTheme} from '@react-navigation/native';
export default function Loginv3({ navigation  }){
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const { navigate } = useNavigation();
  const { activarsesion, setActivarsesion } = useContext(AuthContext);
  const { versionsys,setVersionsys } = useContext(AuthContext);
  const {sesiondata, setSesiondata} = useContext(AuthContext);
  const { reiniciarvalores } = useContext(AuthContext);
  const {periodo, setPeriodo} = useContext(AuthContext);
  const {  actualizarEstadocomponente } = useContext(AuthContext);
  const [errorversion,setErrorversion]=useState(false)
  const [linkdescarga,setLinkdescarga]=useState('')
  const { colors,fonts  } = useTheme();
  const [username, setUsername] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [botonActivado, setBotonActivado] = useState(false);
  const [mostrarContrasena, setMostrarContrasena] = useState(false);

  const [visibledialogo, setVisibledialogo] = useState(false)
  const[mensajeerror,setMensajeerror]=useState('')
  const [ready,setReady]=useState(false)
  
  const showDialog = () => setVisibledialogo(true);
  const hideDialog = () => setVisibledialogo(false);
  const handleError = (errorObject) => {
    if (typeof errorObject === "object" && errorObject !== null) {
      return Object.entries(errorObject)
        .map(([key, value]) => `${key}: ${Array.isArray(value) ? value.join(", ") : value}`)
        .join("\n");
    }
    return String(errorObject); // Si no es objeto, lo convierte a string directamente
  };



 
  const handleUserChange = (text) => {
    setUsername(text.trim());
    checkActivacionBoton(text, contrasena);
  };

  const handleContrasenaChange = (text) => {
    setContrasena(text);
     checkActivacionBoton(username, text);
  };

  const checkActivacionBoton = (doc, pass) => {
    if (doc !== '' && pass !== '') {
      setBotonActivado(true);
    } else {
      setBotonActivado(false);
    }
  };

  const toggleMostrarContrasena = () => {
    setMostrarContrasena(!mostrarContrasena);
  };

  const getPushToken = async () => {
    try {
      // Verificar el estado del permiso de notificaciones
      let notificationPermission = await SecureStore.getItemAsync("notificationPermission");
  
      // Si no hay permiso, solicitarlo
      if (notificationPermission !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        notificationPermission = status; // Actualizar el estado del permiso
        await SecureStore.setItemAsync("notificationPermission", status); // Guardar el nuevo estado
      }
  
      // Si el permiso es concedido, obtener el token
      if (notificationPermission === "granted") {
        const token = (await Notifications.getExpoPushTokenAsync()).data;
        if (token) {
          return token; // Devolver el token
        }
      } else {
        Alert.alert(
          "Permisos de notificaciones",
          "Por favor, habilita los permisos de notificaciones para recibir alertas importantes."
        );
      }
  
      // Si no hay permiso o no se pudo obtener el token, retornar null
      return null;
    } catch (error) {
      console.error("Error al obtener el token de notificación:", error);
      return null; // Retornar null en caso de error
    }
  };

  const ingresar= async ()=>{
    const pushToken = await getPushToken();
    // console.log('el token obtenido es, ', pushToken)
    actualizarEstadocomponente('tituloloading','Iniciando Sesion..')
    actualizarEstadocomponente('loading',true)
    const datos =await Iniciarsesion(username, contrasena,versionsys,pushToken)
    const resp=datos['resp']
    if(resp===200){
        
        // await AsyncStorage.setItem("user", (JSON.stringify(datos['data']['token'])));
        
        
        const userdata={
            token:datos['data']['token'],
            sesion:datos['data']['sesion'],
            refresh:datos['data']['refresh'],
            user_name:datos['data']['user_name'],
        }
        await Handelstorage('agregar',userdata,'')
        // setSesionname(datos['data']['user_name'])
        const datestorage=await Handelstorage('obtenerdate');
        
        const anno_storage=datestorage['dataanno']
        
        setPeriodo(datestorage['dataperiodo'])
        
        actualizarEstadocomponente('DiaActual',datos['data'].dia_actual)
        if( anno_storage===0){

            await new Promise(resolve => setTimeout(resolve, 1500))
            
            const datestorage2=await Handelstorage('obtenerdate');
            
            setPeriodo(datestorage2['dataperiodo'])

        }
        reiniciarvalores()
        
        setSesiondata(datos['data']['datauser'])
        actualizarEstadocomponente('tituloloading','')
        actualizarEstadocomponente('loading',false)
        setActivarsesion(true)
        
       
    }else{
      actualizarEstadocomponente('tituloloading','')
      actualizarEstadocomponente('loading',false)

      if (resp===400){
        showDialog(true)
        setMensajeerror( handleError(datos['data']['error']))
      }else{
        const registros=datos['data']['error']
        showDialog(true)
        setMensajeerror( handleError(datos['data']['error']))
        setErrorversion(true)
        setLinkdescarga(registros.link)
      }
      

      
        
    }

    
  }

  const registrarse=()=>{
     navigate("RegistroUsuario")
  }

  const rescuperarpass=()=>{
    navigate("RecuperacionConraseña")
 }

  const cargardatos=async()=>{
    setReady(false)
    const endpoint='ComprobarVersion/'
    const datosregistrar = {
      version:versionsys
    }
    try {

      const result = await Generarpeticion(endpoint, 'POST', datosregistrar);
      const respuesta=result['resp']
      
      
      
      if (respuesta === 200) {
        
        const datosstarage = await ComprobarStorage()
        
        const credenciales=datosstarage['datosesion']
        
        
        if (credenciales) {
        
            
            
            //activarspin()
            actualizarEstadocomponente('tituloloading','Comprobando Sesion..')
            actualizarEstadocomponente('loading',true)
            
            const body = {
              version:versionsys,
            };
            const endpoint='ComprobarSesionUsuario/'
            const result = await Comprobarsesion(endpoint, 'POST', body);
            const respuesta=result['resp']
            
            
            if (respuesta === 200){
                
                // setSesionname(datosstarage['user_name'])
                const datestorage=await Handelstorage('obtenerdate');
                setPeriodo(datestorage['dataanno'])
                const registros=result['data']
                
                setSesiondata(registros)
                actualizarEstadocomponente('DiaActual',registros[0]['dia_actual'])
                actualizarEstadocomponente('tituloloading','')
                
                actualizarEstadocomponente('loading',false)
                setActivarsesion(true)
                
            }else if (respuesta === 6000){
              
                actualizarEstadocomponente('tituloloading','')
                actualizarEstadocomponente('loading',false)
                setActivarsesion(false)
            } else if (respuesta === 400){
    
              await Handelstorage('borrar')
              await new Promise(resolve => setTimeout(resolve, 1000))
              setActivarsesion(false)
              setErrorversion(true)
              setLinkdescarga(result['data']['link'])
              actualizarEstadocomponente('tituloloading','')
              actualizarEstadocomponente('loading',false)
    
            }else {
              
              
              await Handelstorage('borrar')
              await new Promise(resolve => setTimeout(resolve, 1000))
              setActivarsesion(false)
              actualizarEstadocomponente('tituloloading','')
              actualizarEstadocomponente('loading',false)
    
            }
            
          
        } else {
          
            await Handelstorage('borrar')
            setActivarsesion(false)
            // setSesionname('')
        }
      }else{
        const registros=result['data']['error']
        
        setErrorversion(true)
        setLinkdescarga(registros.link)
        
      }
    }catch (error) {
        Alert.alert("Error", "Error al conectarse al servidor");
        setReady(false)
    } finally {
        setReady(true)
      }




    
}



  useEffect(() => {

    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        setKeyboardVisible(true); // Ocultar el botón cuando el teclado se muestra
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setKeyboardVisible(false); // Mostrar el botón cuando el teclado se oculta
      }
    );

    
    cargardatos()
    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  const combinedTheme = {
    ...PaperDefaultTheme, // Base de Paper
    ...NavigationDefaultTheme, // Base de Navigation
    colors: {
      ...PaperDefaultTheme.colors,
      ...NavigationDefaultTheme.colors, 
      
    },
    fonts: {
      regular: { fontFamily: fonts.bodyregular.fontFamily },
                    medium: { fontFamily: fonts.bodyregular.fontFamily },
                    light: { fontFamily: fonts.bodyregular.fontFamily },
                    thin: { fontFamily: fonts.bodyregular.fontFamily },
                    bodySmall: { fontFamily: fonts.bodyregular.fontFamily },
                    bodyLarge: { fontFamily: fonts.bodyregular.fontFamily },
                    labelLarge: { fontFamily: fonts.bodyregular.fontFamily },
                    // 👇 Agrega las que faltan
                    headlineSmall: { fontFamily: fonts.bodyregular.fontFamily },
                    headlineMedium: { fontFamily: fonts.bodyregular.fontFamily },
                    headlineLarge: { fontFamily: fonts.bodyregular.fontFamily },
                    titleSmall: { fontFamily: fonts.bodyregular.fontFamily },
                    titleMedium: { fontFamily: fonts.bodyregular.fontFamily },
                    titleLarge: { fontFamily: fonts.bodyregular.fontFamily },
                    labelSmall: { fontFamily: fonts.bodyregular.fontFamily },
                    displaySmall: { fontFamily: fonts.bodyregular.fontFamily },
                    displayMedium: { fontFamily: fonts.bodyregular.fontFamily },
                    displayLarge: { fontFamily: fonts.bodyregular.fontFamily },
    },
  };
      
   const text_paper_backgroundcolor=colors.InputTextBackground
    const text_paper_backgroundcolor_inactivo="#DEDDDC"
    // const text_paper_primary="#91918F"
    const text_paper_primary=colors.BotonTextInactive
    const text_paper_roundness=17
    const text_paper_font=fonts.regular.fontFamily
    const text_paper_color='black'
    const text_paper_height=40
 if (ready){
  
   return (
      
        <PaperProvider theme={combinedTheme}>
  
          <View style={styles.containerPrincipal}>
        
              <ImageBackground
                source={require('../../../assets/logowomen.png')}
                style={styles.imageBackground}
                imageStyle={styles.imageStyle} // Ajustes de la imagen
                blurRadius={5} // Desenfoque
              >
  
                <Portal>
  
                      <Dialog visible={visibledialogo} onDismiss={hideDialog}>
                          <Dialog.Icon icon="alert-circle" size={50} color="red"/>
                          <Dialog.Title>ERROR</Dialog.Title>
                          <Dialog.Content>
                              <Text variant="bodyMedium">{mensajeerror}</Text>
                              
                          </Dialog.Content>
                          <Dialog.Actions>
                              <Button onPress={hideDialog}>OK</Button>
                              
                          </Dialog.Actions>
                      </Dialog>
                </Portal>
                {
                  !errorversion ?(
                    <>
                    
                      
                      <Text style={[styles.welcomeText,{ fontFamily: fonts.regularbold.fontFamily,color:colors.BotonTextInactive }]}>¡Bienvenida!!</Text>
  
                      <View style={styles.containerSecundario}>                    
                      <TextInput
                            theme={{colors: { primary:text_paper_primary},roundness: text_paper_roundness}}
                            style={{
                              fontFamily:  text_paper_font,
                              backgroundColor: text_paper_backgroundcolor ,
                              paddingStart: 10,
                              marginTop: 20,
                              width: '80%',
                              
                              
                            }}
                            
                            mode="outlined"
                            textColor={text_paper_color}
                            label="USUARIO"
                            
                            placeholder="Usuario"
                            
                            onChangeText={handleUserChange} 
                          />
                          
                          <TextInput
                            mode="outlined"
                            textColor={text_paper_color}
                            label="CONTRASEÑA"
                            placeholder="Ingrese Contraseña"
                            style={{
                              fontFamily:  text_paper_font,
                              backgroundColor: text_paper_backgroundcolor ,
                              paddingStart: 10,
                              marginTop: 20,
                              width: '80%',
                              marginBottom:30
                              
                            }}
                            value={contrasena}
                            onChangeText={handleContrasenaChange}
                            theme={{colors: { primary:text_paper_primary},roundness: text_paper_roundness}}
                            secureTextEntry={!mostrarContrasena}
                            right={
                              <TextInput.Icon
                                icon={mostrarContrasena ? 'eye-off' : 'eye'}
                                color={colors.BotonActive}
                                onPress={toggleMostrarContrasena}
                              />}
  
                          />
                          {/* <Text style={styles.TextContra}>Olvidé mi contraseña</Text> */}
  
                        {
                          !isKeyboardVisible && (
  
                            <Button  
                              style={[styles.button, botonActivado ? {backgroundColor:colors.BotonActive} : {backgroundColor:colors.BotonInactive}]}
                              disabled={!botonActivado}
                              onPress={() => ingresar()}
                              >                                
                              <Text 
                              style={[
                                styles.buttonText,
                                botonActivado ? {color:colors.BotonTextActive} : {color:colors.BotonTextInactive}, // Condicional para estilos
                                { fontFamily: fonts.bodybold.fontFamily },    // Fuente personalizada
                              ]}
                              >
                                INGRESAR</Text>
                            </Button>
                          )
                        }
                        
                      </View> 
                        {
                          !isKeyboardVisible && (
  
                            <View style={{alignContent:'center',alignItems:'center',marginTop:50}}>
  
                              <Text style={[styles.textPulsa,{fontFamily:fonts.bodyregular.fontFamily,color:text_paper_color}]}>
                              ¿No tienes una cuenta?{' '}
                              <TouchableOpacity onPress={() => registrarse()}>
                                <Text style={[styles.linkText,{fontFamily:fonts.bodyregular.fontFamily,color:colors.BotonTextInactive}]}>Regístrate aquí.</Text>
                              </TouchableOpacity>
                              </Text>

                              <Text style={[styles.textPulsa,{fontFamily:fonts.bodyregular.fontFamily,marginTop:10,color:text_paper_color}]}>
                              ¿Te has olvidado tu contraseña?{' '}
                              <TouchableOpacity onPress={() => rescuperarpass()}>
                                <Text style={[styles.linkText,{fontFamily:fonts.bodyregular.fontFamily,color:colors.BotonTextInactive}]}>Recuperar.</Text>
                              </TouchableOpacity>
                              </Text>

                              <Text style={{color: colors.text,fontSize:18,marginTop:50,fontFamily:fonts.bodyregular.fontFamily,color:colors.BotonTextInactive,}}> Versión {versionsys} </Text>
  
                            </View>
                            
                          )
  
                        }
                        
                      
                    
                    </>
                  ):(
                    <View style={{padding:50, alignItems: "center",}}>
  
                        <Text style={[styles.welcomeText,{ fontFamily: fonts.regularbold.fontFamily,marginBottom:30 }]}>¡¡Versión desactualizada!!</Text>
  
                         <LottieView source={require("../../../assets/alert.json")} style={{ width: 200, height: 200 }} autoPlay loop />
                        <Text style={[styles.contenido,{fontFamily: fonts.regular.fontFamily,color:colors.acctionsbotoncolor}]} >✅ Descarga la versión actualizada desde este enlace.</Text>
                        <Text style={[styles.contenido,{fontFamily: fonts.regular.fontFamily,color:colors.acctionsbotoncolor}]}>✅ En las opciones, selecciona "Instalador de paquetes"</Text>
                        <Text 
                          style={{ color: 'white', textDecorationLine: 'underline',fontFamily: fonts.regular.fontFamily,marginTop:10}} 
                          onPress={() => Linking.openURL(linkdescarga)}
                        >
                          {linkdescarga}
                        </Text>
                    </View>
                  )
                }
                  
              </ImageBackground>
  
          </View>
        </PaperProvider>
      )
 } else{
  return(
    <View style={styles.containerPrincipal}>
      <ImageBackground
                source={require('../../../assets/logowomen.png')}
                style={styles.imageBackground}
                imageStyle={styles.imageStyle} // Ajustes de la imagen
                blurRadius={5} // Desenfoque
              >
                </ImageBackground>
    </View>
  )
 }
};

const styles = StyleSheet.create({
 containerPrincipal: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    borderColor: 'white', 
    // backgroundColor: 'rgb(28,44,52)',
    justifyContent: 'center',

  },
  containerSecundario: {
    width: "98%",
    // height: "30%",
    marginTop:40,
    alignItems: "center",
    borderRadius:50,
    borderColor: 'white',
    borderWidth: 2,
    color:'white',
   // backgroundColor: 'rgb(206, 207, 219)',
  },
 
  image: {
    width:200,
    height:200,
    marginTop:10,
  },
  textPulsa: {
    color: 'white',
    textAlign: 'center',
    width: 300,
    fontSize:17
    // marginTop: 90,
  },
  button:{
    width:'80%',
    // height: '18%',
    height:60,
    backgroundColor: '#e3e7e3',
    justifyContent: 'center',
    
    marginBottom:30
   },
   buttonText:{
    alignItems: "center",
    fontSize:18,
    
   },
  TextContra:{
    color: 'blue',
    marginLeft:150,
    marginTop:5,    
  },
 
  containerExtra: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 90,
    marginLeft:15,
  },
  item: {
    paddingHorizontal: 30,
    alignItems: 'center',
  },
  separator: {
    height: '100%',
    backgroundColor: 'gray',
  },
  linkText: {
    
    textDecorationLine: 'underline',
    top: 12,
    left:5,
    fontSize:18
  },
  welcomeText: {
    fontSize: 50,
    marginBottom: 20,
    textAlign: 'center',
    top:40,
    },
  imageBackground: {
      flex: 1,
      width: '100%',
      height: '100%',
      justifyContent: 'center',
      alignItems: "center",
    },
  imageStyle: {
      opacity: 0.5, // Transparencia
    },
  contenido:{
      marginBottom:10,
      // color:'green'
    }
});


