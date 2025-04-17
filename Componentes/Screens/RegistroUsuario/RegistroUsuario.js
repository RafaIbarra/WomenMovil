import React,{useState, useContext } from "react";
import {View,Text,StyleSheet,Alert,TouchableOpacity,ScrollView  } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import moment from 'moment';

import { Button, TextInput,Dialog, Portal,PaperProvider,DefaultTheme as PaperDefaultTheme  } from 'react-native-paper';
import { useNavigation } from "@react-navigation/native";
import { useTheme,DefaultTheme as NavigationDefaultTheme } from '@react-navigation/native';

import { AntDesign } from '@expo/vector-icons'


import Handelstorage from "../../../Storage/handelstorage";

import ScreensCabecera from "../../ScreensCabecera/ScreensCabecera";
import ApiRegistroUsuario from "../../../Apis/apiregistrousuario";
import { AuthContext } from "../../../AuthContext";

import MaterialIcons from '@expo/vector-icons/MaterialIcons';

function RegistroUsuario({  navigation }){
    const [title,setTitle]=useState('Registro Usuario')
    const [backto,setBackto]=useState('back')
    const {activarsesion, setActivarsesion } = useContext(AuthContext);
    const {periodo, setPeriodo} = useContext(AuthContext);
    const {sesiondata, setSesiondata} = useContext(AuthContext);
    const {actualizarEstadocomponente } = useContext(AuthContext);

    const { colors,fonts } = useTheme();
    const { navigate } = useNavigation();
    

    const [nombre,setNombre]=useState('')
    const [apellido,setApellido]=useState('')
    const [fechanac,setFechanac]=useState(new Date());
    const [show, setShow] = useState(false);
    const [username,setUsername]=useState('')
    const [correo,setCorreo]=useState('')
    
    const [telefono,setTelefono]=useState('')



    const [visibledialogo, setVisibledialogo] = useState(false)
    const[mensajeerror,setMensajeerror]=useState('')
    const [pass,setPass]=useState('')
    const[mostrarContrasena,setMostrarContrasena]=useState(true)

    const [pass2,setPass2]=useState('')
    const[mostrarContrasena2,setMostrarContrasena2]=useState(true)
    

    const showDialog = () => setVisibledialogo(true);
    const hideDialog = () => setVisibledialogo(false);

    const onChange = (event, selectedDate) => {
        const currentDate = selectedDate || fechanac;
        setShow(false); // Para iOS, mantener el picker abierto
        setFechanac(currentDate); // Guardar la fecha seleccionada
        
      };



 

    const showDatePicker = () => {
        setShow(true); // Mostrar el picker
      };
   
  
    
    const textoruc=(valor)=>{
        setRuc(valor)
        const div=calcularDV(valor)
        
        setDigitoverificador(div.toString())
      }

    const toggleMostrarContrasena = () => {
        
        setMostrarContrasena(!mostrarContrasena);
      };
    const toggleMostrarContrasena2 = () => {
        
        setMostrarContrasena2(!mostrarContrasena2);
      };


 






    const registrar = async()=>{

        if(pass===pass2){
            
            
            actualizarEstadocomponente('tituloloading','Registrando Nuevo Usuario..')
            actualizarEstadocomponente('loading',true)
            const fechaFormateada= moment(fechanac).format('YYYY-MM-DD')
            const datosregistrar = {
                nombre:nombre,
                apellido:apellido,
                nacimiento:fechaFormateada,
                user:username,
                correo:correo,
                telefono:telefono,
             
                password:pass
                

            };

            //console.log(datosregistrar)
            const datos =await ApiRegistroUsuario(datosregistrar)
            actualizarEstadocomponente('tituloloading','')
            actualizarEstadocomponente('loading',false)

            if(datos['resp']===200){
                
                
                const userdata={
                    token:datos['data']['token'],
                    sesion:datos['data']['sesion'],
                    refresh:datos['data']['refresh'],
                    user_name:datos['data']['user_name'],
                }
                
                await Handelstorage('agregar',userdata,'')
                actualizarEstadocomponente('DiaActual',datos['data'].dia_actual)
                await new Promise(resolve => setTimeout(resolve, 2000))
                const datestorage=await Handelstorage('obtenerdate');
                const mes_storage=datestorage['datames']
                const anno_storage=datestorage['dataanno']
                
                setPeriodo(datestorage['dataperiodo'])
                if(mes_storage ===0 || anno_storage===0){

                    await new Promise(resolve => setTimeout(resolve, 1500))
                    
                    const datestorage2=await Handelstorage('obtenerdate');
                    
                    setPeriodo(datestorage2['dataperiodo'])

                }
                
                setSesiondata(datos['data']['datauser'])
                actualizarEstadocomponente('tituloloading','')
                actualizarEstadocomponente('loading',false)
                setActivarsesion(true)
            }else{
                
                
                const errores=datos['data']['error']
                
                let mensajeerror = '';
                for (let clave in errores) {
                    mensajeerror += `${clave}: ${errores[clave]}. `;
                }

                showDialog(true)
                setMensajeerror(mensajeerror)
                

            }

        }else{
            Alert.alert("Contraseñas", "Las contraseñas deben coincidir.");
        }
        
    }
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
     
    return(
        <PaperProvider theme={combinedTheme}>

            <View style={styles.container}>
                    <ScreensCabecera navigation={navigation} title={title} backto={backto}></ScreensCabecera>
                    
                        {/* {guardando &&(<Procesando></Procesando>)} */}
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
                        <View style={{flex:1}}>
                            <ScrollView 
                            // style={{padding:5,maxHeight:'90%',marginLeft:10,marginRight:10,marginBottom:10}}
                            style={{padding:5,marginLeft:10,marginRight:10}}
                            contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}
                            >

                                
                                <View style={{flex: 3,marginRight:10}}>
                                   

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
                                    label="Nombre"
                                    
                                    placeholder="Nombre"
                                    
                                    onChangeText={setNombre} 
                                    />
                                </View>


                                
                                <View style={{flex: 3,marginRight:10}}>
                                   
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
                                        label="Apellido"
                                        
                                        placeholder="Apellido"
                                        
                                        onChangeText={setApellido} 
                                        />



                                </View>
                                <View style={{ flexDirection: "row", width: "100%",}}>

                                    <View 
                                    // style={{flex: 7,}}
                                    style={{width:'80%'}}
                                    >

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
                                        label="Fecha Nac"
                                        value={moment(fechanac).format('DD/MM/YYYY')}
                                        placeholder="Fecha Nacimiento"
                                        
                                        
                                        />
                                    
                                    </View>
                                    <View 
                                    style={{marginLeft:20,marginTop:10}}
                                    // style={{flex: 1,}}
                                    >

                                    <TouchableOpacity 
                                        style={styles.botonfecha} onPress={showDatePicker}>         
                                        <AntDesign name="calendar" size={35} color={colors.acctionsbotoncolor} />
                                    </TouchableOpacity>
                                    </View>
                                    {show && (
                                    <DateTimePicker
                                        value={fechanac}
                                        mode="date" // Puede ser "date", "time" o "datetime"
                                        display="default" // Opciones: "default", "spinner", "calendar" (varía según el SO)
                                        onChange={onChange}
                                    />
                                    )}
                                </View>

                                
                                
                                <View style={{flex: 3,marginRight:10}}>
                                    
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
                                        label="User Name"
                                        
                                        placeholder="User Name"
                                        
                                        onChangeText={setUsername} 
                                        />

                                </View>
                                
                                <View style={{flex: 3,marginRight:10}}>
                                    
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
                                                                label="Correo"
                                                                
                                                                placeholder="Correo"
                                                                
                                                                onChangeText={setCorreo} 
                                                              />
                                </View>

                                <View style={{ flexDirection: "row", width: "100%",justifyContent: "space-between",}}>

                                    <View style={{flex: 3,marginRight:10}}>
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
                                                                    label="Telefono"
                                                                    
                                                                    placeholder="Telefono"
                                                                    
                                                                    onChangeText={setTelefono} 
                                                                  />
                                    </View>
                                    
                                </View>

                                
                                <View style={{flex: 3,marginRight:10}}>
                                    
                                     <TextInput
                                                                mode="outlined"
                                                                textColor={text_paper_color}
                                                                label="Ingrese Contraseña"
                                                                placeholder="Ingrese Contraseña"
                                                                style={{
                                                                  fontFamily:  text_paper_font,
                                                                  backgroundColor: text_paper_backgroundcolor ,
                                                                  paddingStart: 10,
                                                                  marginTop: 20,
                                                                  
                                                                  
                                                                  
                                                                }}
                                                                value={pass}
                                                                onChangeText={setPass}
                                                                theme={{colors: { primary:text_paper_primary},roundness: text_paper_roundness}}
                                                                secureTextEntry={!mostrarContrasena}
                                                                right={
                                                                  <TextInput.Icon
                                                                    icon={mostrarContrasena ? 'eye-off' : 'eye'}
                                                                    color={colors.BotonActive}
                                                                    onPress={toggleMostrarContrasena}
                                                                  />}
                                      
                                                              />
                                </View>
                                <View style={{flex: 3,marginRight:10}}>
                                    
                                    <TextInput
                                                                mode="outlined"
                                                                textColor={text_paper_color}
                                                                label="Repita Contraseña"
                                                                placeholder="Repita Contraseña"
                                                                style={{
                                                                  fontFamily:  text_paper_font,
                                                                  backgroundColor: text_paper_backgroundcolor ,
                                                                  paddingStart: 10,
                                                                  marginTop: 20,
                                                                  
                                                                  
                                                                  
                                                                }}
                                                                value={pass2}
                                                                onChangeText={setPass2}
                                                                theme={{colors: { primary:text_paper_primary},roundness: text_paper_roundness}}
                                                                secureTextEntry={!mostrarContrasena2}
                                                                right={
                                                                  <TextInput.Icon
                                                                    icon={mostrarContrasena2 ? 'eye-off' : 'eye'}
                                                                    color={colors.BotonActive}
                                                                    onPress={toggleMostrarContrasena2}
                                                                  />}
                                      
                                                              />
                                </View>
                                <View style={{flex:1,alignContent:'center',alignItems:'center'}}>

                                <Button style={{marginBottom:10,marginTop:10,width:'90%',height:60,backgroundColor:colors.BotonActive,justifyContent:'center'}} 
                                    mode="elevated" 
                                    
                                    onPress={() => registrar()}
                                >
                                     <Text style={[styles.buttonText,{ fontFamily: fonts.bodyregular.fontFamily,color:colors.BotonTextActive }]}>REGISTRARSE</Text> 
                                </Button>
                            </View>
                            </ScrollView>

                            
                        </View>
                    
                
            </View>
        
        </PaperProvider>

        

        
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        
      },
    cabeceracontainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderBottomWidth: 1,
        marginBottom:10,
        
        
      },

      buttonText:{
        alignItems: "center",
        fontSize:18,
        
       },
    inputtextactivo:{
        //borderBottomColor: 'rgb(44,148,228)', // Cambia el color de la línea inferior aquí
        textAlignVertical: 'center',
        paddingVertical: 3,
        lineHeight: 18,
        flex: 1,
        borderBottomWidth: 2,
        marginBottom:35,
        paddingLeft:10,
        fontSize: 14,
        
      }
      ,
      botonfecha:{
        width: 50, 
        height: 35, 
  
        marginLeft:'5%',
        marginBottom:27
      },

    textPulsa: {
        color: 'white',
        textAlign: 'center',
        width: 300,
        marginTop: 40,
      },

    linkText: {
        color: 'rgba(218,165,32,0.7)',
        textDecorationLine: 'underline',
        top: 5,
      },
    botonfecha:{
        width: 50, 
        height: 35, 
  
        marginLeft:'5%',
        marginTop:20
        // marginBottom:27
      },
  
      

})

export default RegistroUsuario