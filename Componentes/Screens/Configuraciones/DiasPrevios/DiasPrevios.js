import React, { useContext,useEffect,useState  } from 'react';
import {  TextInput,PaperProvider,DefaultTheme as PaperDefaultTheme} from'react-native-paper';
import {  View,StyleSheet,TouchableOpacity,Text } from "react-native";
import { useTheme,DefaultTheme as NavigationDefaultTheme } from '@react-navigation/native';
import { useNavigation } from "@react-navigation/native";
import { AuthContext } from '../../../../AuthContext';
import Handelstorage from '../../../../Storage/handelstorage';
import Generarpeticion from '../../../../Apis/peticiones';

import Entypo from '@expo/vector-icons/Entypo';
function DiasPrevios({setMensajeerror,showDialog,setTituloerror,actualizardatos}){
    const { activarsesion, setActivarsesion } = useContext(AuthContext);
    const { actualizarEstadocomponente } = useContext(AuthContext);
    const { colors,fonts } = useTheme();
    const { navigate } = useNavigation();
    const [cantdias,setCantdias]=useState(0)
    const [idregistro,setIdregistro]=useState(0)

    

    const registrar=  async()=>{
        // if (codigofacturaoperacion>0){
        //   actualizarEstadocomponente('tituloloading','ACTUALIZANDO DATOS FACTURA..')
        // }else{
    
        //   actualizarEstadocomponente('tituloloading','REGISTRANDO FACTURA MANUAL..')
        // }
        actualizarEstadocomponente('tituloloading','Registrando Configuracion')
        actualizarEstadocomponente('loading',true)
       
        
        const datosregistrar = {
          codregistro:idregistro,
          cantdias:cantdias,
         
              
        };
        const endpoint='RegistroDiasPrevio/'
        const result = await Generarpeticion(endpoint, 'POST', datosregistrar);
        // actualizarEstadocomponente('tituloloading','')
        actualizarEstadocomponente('loading',false)
        const respuesta=result['resp']
        if (respuesta === 200) {
          
          await cargardatos()
          
          
        } else if(respuesta === 403 || respuesta === 401){
    
          await Handelstorage('borrar')
          setActivarsesion(false)
          
        } else{
            await cargardatos()
          setTituloerror('ERROR REGISTRO CONFIGURACION')
          setMensajeerror( handleError(result['data']['error']))
          showDialog(true)
          
          
     
        //volver()
        // navigate("MainTabs2", { })
        
        //navigation.goBack();
        }
    
    
    }
    const handleError = (errorObject) => {
        if (typeof errorObject === "object" && errorObject !== null) {
          return Object.entries(errorObject)
            .map(([key, value]) => `${key}: ${Array.isArray(value) ? value.join(", ") : value}`)
            .join("\n");
        }
        return String(errorObject); // Si no es objeto, lo convierte a string directamente
      };
    const aumentar = () => {
        const nuevoano = cantdias + 1;
        if (nuevoano <= 15){

            setCantdias(nuevoano);
        }
        
      };
    
      const disminuir = () => {
        const nuevoano = cantdias - 1;
        if (nuevoano > 0){

            setCantdias(nuevoano);
        }
      }


    const cargardatos=async()=>{
        
        const body = {};
        const endpoint='ObtenerDiasPrevios/'
        const result = await Generarpeticion(endpoint, 'POST', body);
        const respuesta=result['resp']

        if (respuesta === 200){
            const registros=result['data']
            
            if (registros.length > 0){
                setCantdias(registros[0]['CantidadDias'])
                setIdregistro(registros[0]['id'])
            }else{
                setCantdias(0)
                setIdregistro(0)
            }
    
            
            
        }else if(respuesta === 403 || respuesta === 401){
            
            
            await Handelstorage('borrar')
            await new Promise(resolve => setTimeout(resolve, 1000))
            setActivarsesion(false)
        }
        
    }
    useEffect(()  => {
        
            const data_result =async()=>{
                await cargardatos()
            }
            data_result()
            
        
    
      
      }, [actualizardatos]);


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
    return(
        <PaperProvider theme={combinedTheme}>

            <View style={{flex:1}}>
                
                <View style={{flex:1,alignContent:'center',alignItems:'center'}}>
                    <View style={{ flexDirection:'row',alignContent:'center',alignItems:'center',justifyContent:'center'}}>

                        <View style={{height:50,width:'50%',marginBottom:20,marginRight:20}}>

                            <TextInput
                                theme={{colors: { primary:text_paper_primary},roundness: text_paper_roundness}}
                                style={{
                                    fontFamily:  text_paper_font,
                                    backgroundColor: text_paper_backgroundcolor ,
                                    paddingStart: 10,
                                    marginTop: 5,
                                    
                                    
                                    
                                }}
                                
                                mode="outlined"
                                textColor={text_paper_color}
                                label="Cantidad Dias"
                                
                                placeholder="Cantidad Dias"
                                value={cantdias.toString()}
                                                                // onChangeText={setAnnoactual} 
                            /> 
                        </View>
                        <View style={styles.buttonContainer}>
                            <TouchableOpacity 
                                style={[styles.configbutton,{borderColor:colors.acctionsbotoncolor,backgroundColor:colors.BotonActive}]}
                                onPress={disminuir}
                                > 
                                        
                                <Entypo name="minus" size={30} color={colors.BotonTextActive} />
                            </TouchableOpacity>

                            <TouchableOpacity 
                                style={[styles.configbutton,{borderColor:colors.acctionsbotoncolor,backgroundColor:colors.BotonActive}]}
                                onPress={aumentar}
                                >         
                                <Entypo name="plus" size={30} color={colors.BotonTextActive} />
                            </TouchableOpacity>
                                    
                        </View>
                    </View>


                    <TouchableOpacity 
                        style={{ 
                        
                            backgroundColor: colors.BotonActive, 
                            height: 50,
                            justifyContent: 'center', 
                            alignItems: 'center', 
                            borderRadius: 20,
                            width: '100%',
                            marginTop:20,
                            marginBottom:20
                        }} 
                        onPress={registrar}
                        >
                        <Text style={{
                            fontSize: 20,
                            color: colors.BotonTextActive, 
                            fontFamily: fonts.bodybold.fontFamily,
                            marginTop:-5
                            
                        }}>
                        Procesar Dias
                        </Text>
                                            
                    </TouchableOpacity>
                </View>
            </View>
        </PaperProvider>
    )
}
const styles = StyleSheet.create({
    container: {
      flex: 1, 
      
    },
    buttonContainer: {
        flexDirection: "row",
        marginTop:0,
        width:'40%',
        justifyContent:'space-between'
      },
      configbutton:{
        width: 50, 
        height: 35, 
        borderWidth:2,
        alignContent:'center',
        alignItems:'center',
        justifyContent:'center',
        borderRadius:5,
        height:50,
        //backgroundColor:'white'
      },
  });
export default DiasPrevios