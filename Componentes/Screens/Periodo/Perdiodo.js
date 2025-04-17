import React,{useState,useEffect,useContext } from "react";
import { useNavigation } from "@react-navigation/native";
import {  View,Text,TouchableOpacity,StyleSheet } from "react-native";
import {  TextInput,PaperProvider,DefaultTheme as PaperDefaultTheme} from 'react-native-paper';
import Handelstorage from "../../../Storage/handelstorage";
import Generarpeticion from "../../../Apis/peticiones";
import { AuthContext } from "../../../AuthContext";
import { useTheme,DefaultTheme as NavigationDefaultTheme } from '@react-navigation/native';

/*Iconos*/

import Entypo from '@expo/vector-icons/Entypo';

import ScreensCabecera from "../../ScreensCabecera/ScreensCabecera";

function Periodo({navigation}){
    const[title,setTitle]=useState('Seleccionar Año')
    const[backto,setBackto]=useState('MainTabs2')
    const { activarsesion, setActivarsesion } = useContext(AuthContext);
    const {periodo, setPeriodo} = useContext(AuthContext);
    const { reiniciarvalores } = useContext(AuthContext);
    const { recargar_componentes } = useContext(AuthContext);
    const { actualizarEstadocomponente } = useContext(AuthContext);
    const { estadocomponente } = useContext(AuthContext);
    const { colors,fonts } = useTheme();
    const { navigate } = useNavigation();
    const [cargacompleta,setCargacopleta]=useState(false)
    const [guardando,setGuardando]=useState(false)

    

    const [annoactual,setAnnoactual]=useState(2025)
    const [annomin,setAnnomin]=useState(0)
    const [annomax,setAnnomax]=useState(0)
    

    const aumentar = () => {
        const nuevoano = annoactual + 1;
        if (nuevoano <= annomax){

            setAnnoactual(nuevoano);
        }
        
      };
    
      const disminuir = () => {
        const nuevoano = annoactual - 1;
        if (nuevoano >= annomin){

            setAnnoactual(nuevoano);
        }
      }

    const procesar = async ()=>{
        setGuardando(true)
        const datadate={
            dataanno:annoactual,
            
          }
        
        await Handelstorage('actualizardate',datadate)
        
        await new Promise(resolve => setTimeout(resolve, 1000))
        setPeriodo(annoactual)
        setGuardando(false)
        actualizarEstadocomponente('tituloloading','Configurando Año..')
        actualizarEstadocomponente('loading',true)
        reiniciarvalores()
        recargar_componentes()

        navigation.navigate('MainTabs2', {
            screen: 'Home', // Nombre exacto de la pantalla en el Tab
          });
    }

    useEffect(() => {
      
        // setCargacopleta(false)
        const cargardatos=async()=>{
            
            const body = {};
            const endpoint='AnnosDisponibles/'
            const result = await Generarpeticion(endpoint, 'POST', body);
            const respuesta=result['resp']
            const datestorage=await Handelstorage('obtenerdate');
            datestorage['dataanno']
            
            const anno_storage=datestorage['dataanno']
            setAnnoactual(anno_storage)

            if (respuesta === 200){
                const registros=result['data']
                
                setAnnomin(registros.Desde)
                setAnnomax(registros.Hasta)
                

                // setAnnoactual(anno_storage)
                
                
            }else if(respuesta === 403 || respuesta === 401){
                
                
                await Handelstorage('borrar')
                await new Promise(resolve => setTimeout(resolve, 1000))
                setActivarsesion(false)
            }
            
           setCargacopleta(true)
            
            // setBusqueda(false)
            // setTextobusqueda('')

           
        }
        cargardatos()
        // setRefresh(false)
      
      
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
    if(cargacompleta){
        return(
            <PaperProvider theme={combinedTheme}>

                <View style={styles.container}>
                    <ScreensCabecera navigation={navigation} title={title} backto={backto} ></ScreensCabecera>
                    <View style={{padding:50,alignContent:'center',alignItems:'center'}}>
                        <View style={{height:50,width:'100%',marginBottom:20}}>

                            <TextInput
                                    theme={{colors: { primary:text_paper_primary},roundness: text_paper_roundness}}
                                    style={{
                                        fontFamily:  text_paper_font,
                                        backgroundColor: text_paper_backgroundcolor ,
                                        paddingStart: 10,
                                        marginTop: 20,
                                        
                                        
                                        
                                    }}
                                    
                                    mode="outlined"
                                    textColor={text_paper_color}
                                    label="Año Actual"
                                    
                                    placeholder="Año Actual"
                                    value={annoactual.toString()}
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
                            onPress={procesar}
                            >
                            <Text style={{
                                fontSize: 20,
                                color: colors.BotonTextActive, 
                                fontFamily: fonts.bodybold.fontFamily,
                                marginTop:-5
                                
                            }}>
                            Seleccionar Año
                            </Text>
                                                
                        </TouchableOpacity>
                    </View>
                </View>
            </PaperProvider>
    
        )
    }
        
}

const styles = StyleSheet.create({
    container: {
      flex: 1, 
      
    },
    buttonContainer: {
        flexDirection: "row",
        marginTop:20,
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
  
export default Periodo