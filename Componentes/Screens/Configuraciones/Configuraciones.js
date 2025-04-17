import React, { useContext,useEffect,useState,useRef  } from 'react';
import {  View,Text,StyleSheet   } from "react-native";
import {  Button,TextInput,Portal,Dialog,PaperProvider,DefaultTheme as PaperDefaultTheme} from'react-native-paper';
import { useTheme,DefaultTheme as NavigationDefaultTheme } from '@react-navigation/native';
import { useNavigation } from "@react-navigation/native";
import ScreensCabecera from '../../ScreensCabecera/ScreensCabecera';
import DiasPrevios from './DiasPrevios/DiasPrevios';
function Configuraciones({navigation}){
    const[title,setTitle]=useState('Configuraciones')
    const[backto,setBackto]=useState('OpcionesStackTabs')
    const { navigate } = useNavigation();
    const { colors,fonts } = useTheme();

    const [visibledialogo, setVisibledialogo] = useState(false)
    const[mensajeerror,setMensajeerror]=useState('')
    const[tituloerror,setTituloerror]=useState('')
    const [actualizardatos,setActualizardatos]=useState(false)
    const showDialog = () => setVisibledialogo(true);
    const hideDialog = () => setVisibledialogo(false);
    

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
    useEffect(()  => {
            const unsubscribe = navigation.addListener('focus', () => {
                
                setActualizardatos(!actualizardatos)
                
            })
            return unsubscribe;
        
          
          }, [navigation,actualizardatos]);

    return(
        <PaperProvider theme={combinedTheme}>

            <View style={{ flex: 1} }>
                <ScreensCabecera navigation={navigation} title={title} backto={backto} ></ScreensCabecera>
                <Portal>
                
                                    <Dialog visible={visibledialogo} onDismiss={hideDialog}>
                                        <Dialog.Icon icon="alert-circle" size={50} color="red"/>
                                        <Dialog.Title>{tituloerror}</Dialog.Title>
                                        <Dialog.Content>
                                            <Text variant="bodyMedium">{mensajeerror}</Text>
                                            
                                        </Dialog.Content>
                                        <Dialog.Actions>
                                            <Button onPress={hideDialog}>OK</Button>
                                            
                                        </Dialog.Actions>
                                    </Dialog>
                                </Portal>
                <View style={[styles.containeropcion]}>
                    <View style={[styles.containertext,{backgroundColor:colors.card,}]}>

                        <Text style={[styles.opciontext,{fontFamily: fonts.bodybold.fontFamily}]}>Notificacion dias Previos</Text>
                    </View>
                    <View style={{paddingLeft:30,paddingRight:30,paddingTop:10,height:200}}>
                        
                    <DiasPrevios setMensajeerror={setMensajeerror} 
                            showDialog={showDialog} setTituloerror={setTituloerror}
                            actualizardatos={actualizardatos}
                            >

                            </DiasPrevios>
                    </View>
                </View>
            </View>
        </PaperProvider>
    )

}
const styles = StyleSheet.create({
    containeropcion: {
      height:210,
      marginTop:10,
      borderWidth:1,
      marginLeft:10,
      marginRight:10,
      borderRadius:10
      
    },
    containertext:{
        // paddingLeft:10,
        // paddingTop:10,
        height:50,
        borderTopLeftRadius:10,
        borderTopRightRadius:10,
        
    }
    ,
    opciontext:{
        
        fontSize:18,
        paddingLeft:10
        
        
    }
   
  });
export default Configuraciones