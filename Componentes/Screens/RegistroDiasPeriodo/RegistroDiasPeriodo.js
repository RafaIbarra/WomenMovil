import React, {useState,useEffect, useContext} from "react";
import { View, Text, StyleSheet,TouchableOpacity,Image,ScrollView ,TextInput} from "react-native";
import { Dialog, Portal,PaperProvider,Button } from 'react-native-paper';
import { useNavigation } from "@react-navigation/native";
import { useTheme } from '@react-navigation/native';
import { AuthContext } from "../../../AuthContext";
import ScreensCabecera from "../../ScreensCabecera/ScreensCabecera";
import Generarpeticion from "../../../Apis/peticiones";
import Handelstorage from "../../../Storage/handelstorage";
import Entypo from '@expo/vector-icons/Entypo';


export default function RegistroDiasPeriodo({ navigation  }){
  const[title,setTitle]=useState('Registrar')
  const[backto,setBackto]=useState('MainTabs2')
  const { activarsesion, setActivarsesion } = useContext(AuthContext);
  const { colors,fonts } = useTheme();
  const { estadocomponente } = useContext(AuthContext);
   const {  actualizarEstadocomponente } = useContext(AuthContext);
   const {  recargar_componentes } = useContext(AuthContext);
  const [datadias,setDatadias]=useState([])
  const [idprimerdia,setIdprimerdia]=useState(0)
  const [valueprimerdia,setValueprimerdia]=useState(0)

  const[idultimodia,setIdultimodia]=useState(0)
  const[valueultimodia,setValueultimodia]=useState(0)

  const [cantdias,setCantdias]=useState(0)

  const [nivelIntensidad, setNivelIntensidad] = useState(0);
  const [tonalidad, setTonalidad] = useState(0);
  const [observacion,setObservacion]=useState('')
  const [fecharegistro,setFecharegistro]=useState('')
  const [Iddia_sel,setIddia_sel]=useState(0)
  const [Idmarca_sel,setMarca_sel]=useState(0)

  const [visibledialogo, setVisibledialogo] = useState(false)
  const[mensajeerror,setMensajeerror]=useState('')
  const showDialog = () => setVisibledialogo(true);
  const hideDialog = () => setVisibledialogo(false);

  const [visibledialogoeliminar, setVisibledialogoeliminar] = useState(false)
  const showDialogeliminar = () => setVisibledialogoeliminar(true);
  const hideDialogeliminar = () => setVisibledialogoeliminar(false);
  
  const handleError = (errorObject) => {
    if (typeof errorObject === "object" && errorObject !== null) {
      return Object.entries(errorObject)
        .map(([key, value]) => `${key}: ${Array.isArray(value) ? value.join(", ") : value}`)
        .join("\n");
    }
    return String(errorObject); // Si no es objeto, lo convierte a string directamente
  };

  
  const actualizarValueUltimoDia = (nuevoId) => {
    const datosActuales = datadias.find((dia) => dia.id === nuevoId);
    if (datosActuales) {
      setValueultimodia(datosActuales.ValorFecha);
    }
  };


  const aumentar = () => {
    const nuevoId = idultimodia + 1;
    setIdultimodia(nuevoId);
    actualizarValueUltimoDia(nuevoId);
    const cant= (nuevoId - idprimerdia  ) +1
    setCantdias(cant)
  };

  const disminuir = () => {
    if (idultimodia > idprimerdia) {
      const nuevoId = idultimodia - 1;
      

      setIdultimodia(nuevoId);
      actualizarValueUltimoDia(nuevoId);
      const cant= (nuevoId -idprimerdia  ) +1
      setCantdias(cant)
    }
  }

  const opciones = [
    { id: "3", imagen: require("../../../assets/blood3.png"), label: "Intenso",value:3 },
    { id: "2", imagen: require("../../../assets/blood2.png"), label: "Medio",value:2  },
    { id: "1", imagen: require("../../../assets/blood1.png"), label: "Bajo",value:1  },
  ];

  const tonalidades = [
    { id: "rojiza", imagen: require("../../../assets/rojizo3.png"), label: "Rojizo",value:1 },
    { id: "marron", imagen: require("../../../assets/tonomarron.png"), label: "Marron",value:2  },
    
  ];
  const volver=()=>{
      
    navigation.navigate('MainTabs2', {
      screen: 'Home', // Nombre exacto de la pantalla en el Tab
    });
    
  }
  const registrar=  async()=>{  
    // if (codigofacturaoperacion>0){
    //   actualizarEstadocomponente('tituloloading','ACTUALIZANDO DATOS FACTURA..')
    // }else{

    //   actualizarEstadocomponente('tituloloading','REGISTRANDO FACTURA MANUAL..')
    // }
    actualizarEstadocomponente('tituloloading','Registrando Datos')
    actualizarEstadocomponente('loading',true)
   
    
    const datosregistrar = {
      codmarca:Idmarca_sel,
      intensidad:nivelIntensidad,
      tipomarca:tonalidad,
      desde:idprimerdia,
      hasta:idultimodia,
  
      observacion:  observacion,
          
    };
    const endpoint='RegistroMarcaUsuario/'
    const result = await Generarpeticion(endpoint, 'POST', datosregistrar);
    // actualizarEstadocomponente('tituloloading','')
    actualizarEstadocomponente('loading',false)
    const respuesta=result['resp']
    if (respuesta === 200) {
      recargar_componentes()
      volver()
      // reiniciarvalorestransaccion()
      // item.recarga='si'
  

      // navigation.goBack();
      
    } else if(respuesta === 403 || respuesta === 401){

      await Handelstorage('borrar')
      await new Promise(resolve => setTimeout(resolve, 1000))
      setActivarsesion(false)
      
    } else{
      
      setMensajeerror( handleError(result['data']['error']))
      showDialog(true)
      
 
    }


  }

  const eliminar=  async()=>{
    // if (codigofacturaoperacion>0){
    //   actualizarEstadocomponente('tituloloading','ACTUALIZANDO DATOS FACTURA..')
    // }else{

    //   actualizarEstadocomponente('tituloloading','REGISTRANDO FACTURA MANUAL..')
    // }
    actualizarEstadocomponente('tituloloading','Eliminando Datos')
    actualizarEstadocomponente('loading',true)
  
    
    const datosregistrar = {
      codmarca:Idmarca_sel,
      
          
    };
    const endpoint='EliminarMarcaUsuario/'
    const result = await Generarpeticion(endpoint, 'POST', datosregistrar);
    // actualizarEstadocomponente('tituloloading','')
    actualizarEstadocomponente('loading',false)
    const respuesta=result['resp']
    if (respuesta === 200) {
      recargar_componentes()
      //recargar_componentes()
      volver()
      // reiniciarvalorestransaccion()
      // item.recarga='si'


      // navigation.goBack();
      
    } else if(respuesta === 403 || respuesta === 401){

      await Handelstorage('borrar')
      await new Promise(resolve => setTimeout(resolve, 1000))
      setActivarsesion(false)
      
    } else{
      
      showDialog(true)
      
      setMensajeerror( handleError(result['data']['error']))

    //volver()
    // navigate("MainTabs2", { })
    
    //navigation.goBack();
    }


  }
useEffect(() => {
  const cargarDatosCompletos = async () => {
    let primerdia_id = 0;
    let ultimoElemento = 0;

    
    setIddia_sel(estadocomponente.IdDiaSeleccion);
    let id_marca_reg = estadocomponente.IdDiaSeleccion;
    
    if (id_marca_reg === 0) {
      // Si no hay marca registrada, usar los datos de diasmarcados
      primerdia_id = estadocomponente.diasmarcados.diassel[0];
      setIdprimerdia(primerdia_id);
      
      setValueprimerdia(estadocomponente.diasmarcados.diavalue);
      ultimoElemento = estadocomponente.diasmarcados.diassel.at(-1);
      
      setIdultimodia(ultimoElemento);
    } else {
      // Si hay marca registrada, primero cargar esos datos
      const cargarid_marca = async () => {
        const body = { id_dia: id_marca_reg };
        const endpoint = "ConsultaMarcaRegistrada/";
        const result = await Generarpeticion(endpoint, "POST", body);
        
        const respuesta = result["resp"];
        
        if (respuesta === 200) {
          const registros = result["data"][0].detalle;
          
          const primerRegistro = registros[0];
          const ultimoRegistro = registros[registros.length - 1];

          primerdia_id = primerRegistro.id;
          
          setIdprimerdia(primerdia_id);
          setValueprimerdia(primerRegistro.ValorFecha);
          ultimoElemento = ultimoRegistro.id;
          setIdultimodia(ultimoElemento);
          const valores = result["data"][0].valores;
          
          setNivelIntensidad(valores[0]['Intensidad'])
          setTonalidad(valores[0]['TipoMarca'])
          setObservacion(valores[0]['Observacion'])
          setFecharegistro(valores[0]['FechaRegistro'])
          setMarca_sel(valores[0]['id'])
          
        }else if(respuesta === 403 || respuesta === 401){
                
          
          await Handelstorage('borrar')
          await new Promise(resolve => setTimeout(resolve, 1000))
          setActivarsesion(false)
        }
      };

      // Esperar a que termine cargarid_marca
      await cargarid_marca();
    }



    const cant= (ultimoElemento - primerdia_id  ) +1
    setCantdias(cant)

    // Ahora cargar los datos del calendario
    const cargardatos = async () => {
      
      const body = { id_dia: primerdia_id };
      const endpoint = "DatosCalendarioMesSiguiente/";
      const result = await Generarpeticion(endpoint, "POST", body);
      const respuesta = result["resp"];
      
      if (respuesta === 200) {
        const registros = result["data"];
        
        setDatadias(registros);
        const datosActuales = registros.find((dia) => dia.id === ultimoElemento);
        setValueultimodia(datosActuales?.ValorFecha || ""); // Evitar error si no encuentra el elemento
      }else if(respuesta === 403 || respuesta === 401){
                
                
        await Handelstorage('borrar')
        await new Promise(resolve => setTimeout(resolve, 1000))
        setActivarsesion(false)
      }
      setReady(true);
    };

    // Esperar a que termine cargardatos
    await cargardatos();
  };

  cargarDatosCompletos(); // Llamar la función asíncrona dentro de useEffect
}, [estadocomponente.Idregistro]);

  return(
    <PaperProvider >

          <View style={[styles.container]}>
              <ScreensCabecera title={title} backto={backto}></ScreensCabecera>
              <Portal>

              <Dialog visible={visibledialogoeliminar} onDismiss={hideDialogeliminar}>
                  <Dialog.Title>Eliminar Registro</Dialog.Title>
                  <Dialog.Content>
                      <Text variant="bodyMedium">{`¿Desea eliminar el registro de la fecha ${valueprimerdia} hasta la fecha  ${valueultimodia}; con ID operacion N°: ${Idmarca_sel}?`}</Text>
                      
                  </Dialog.Content>
                  <Dialog.Actions>
                      <Button onPress={hideDialogeliminar}>Cancelar</Button>
                      <Button onPress={eliminar}>ELIMINAR</Button>
                  </Dialog.Actions>
              </Dialog>
            </Portal>


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
              <View style={styles.bodycontainer}>
                <View style={styles.fechascontainer}>
                    <Text style={[ styles.textfechas, {fontFamily: fonts.bodybold.fontFamily}]}>Del : {valueprimerdia}</Text>
                    <Text style={[ styles.textfechas, {fontFamily: fonts.bodybold.fontFamily}]}>Al: {valueultimodia}</Text>
                    
                </View>
              
                <View style={{width:'100%',justifyContent:'center',alignItems:'center',alignContent:'center'}}>
                    <Text style={[ {fontFamily: fonts.bodybold.fontFamily,fontSize:18}]}>Cant dias: {cantdias}</Text>
                    <View style={styles.buttonContainer}>
                          <TouchableOpacity 
                              style={[styles.configbutton,{borderColor:colors.acctionsbotoncolor,backgroundColor:colors.BotonActive}]}
                              onPress={disminuir}> 
                                      
                              <Entypo name="minus" size={30} color={colors.BotonTextActive} />
                          </TouchableOpacity>

                          <TouchableOpacity 
                              style={[styles.configbutton,{borderColor:colors.acctionsbotoncolor,backgroundColor:colors.BotonActive}]}
                              onPress={aumentar}>         
                              <Entypo name="plus" size={30} color={colors.BotonTextActive} />
                          </TouchableOpacity>
                          
                    </View>
                </View>

              <ScrollView style={{marginTop:10}} contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>

                  

                  <View style={styles.containerintensidad}>
                      <View style={[styles.containerTituloIntensidad,{backgroundColor:colors.background}]}>
                        <Text style={[styles.tituloIntensidad,{fontFamily: fonts.bodybold.fontFamily}]}>Nivel Intensidad</Text>
                      </View>
                        {opciones.map((opcion) => (
                          <View key={opcion.id} style={styles.containeritemintensidad}>
                            <TouchableOpacity
                              style={[
                                styles.botonintensidad,
                                { backgroundColor: nivelIntensidad === opcion.value ? colors.card : "transparent",borderColor:colors.card },
                              ]}
                              onPress={() => setNivelIntensidad(opcion.value)}
                            >
                              <Image source={opcion.imagen} style={styles.botonintensidadimagen} />
                            </TouchableOpacity>
                            <Text
                              style={[
                                styles.textintensidad,
                                { fontFamily: nivelIntensidad === opcion.value ? fonts.bodybold.fontFamily : fonts.bodyregular.fontFamily },
                              ]}
                            >
                              {opcion.label}
                            </Text>
                          </View>
                        ))}
                  </View>

                  <View style={styles.containerintensidad}>
                      <View style={[styles.containerTituloIntensidad,{backgroundColor:colors.background}]}>
                        <Text style={[styles.tituloIntensidad,{fontFamily: fonts.bodybold.fontFamily}]}>Tonalidad</Text>
                      </View>
                        {tonalidades.map((tonalidades) => (
                          <View key={tonalidades.id} style={styles.containeritemintensidad}>
                            <TouchableOpacity
                              style={[
                                styles.botonintensidad,
                                { backgroundColor: tonalidad === tonalidades.value ? colors.card : "transparent",borderColor:colors.card },
                              ]}
                              onPress={() => setTonalidad(tonalidades.value)}
                            >
                              <Image source={tonalidades.imagen} style={styles.botonintensidadimagen} />
                            </TouchableOpacity>
                            <Text
                              style={[
                                styles.textintensidad,
                                { fontFamily: tonalidad === tonalidades.value ? fonts.bodybold.fontFamily : fonts.bodyregular.fontFamily },
                              ]}
                            >
                              {tonalidades.label}
                            </Text>
                          </View>
                        ))}
                  </View>

                  <View style={styles.containernota}>
                      <View style={[styles.containerTituloIntensidad,{backgroundColor:colors.background}]}>
                        <Text style={[styles.tituloIntensidad,{fontFamily: fonts.bodybold.fontFamily}]}>Comentario O Nota</Text>
                      </View>
                      <TextInput
                        style={[
                          
                          { borderColor: colors.card,fontFamily: fonts.bodyregular.fontFamily,fontSize:17 } // Opcional: usa el color del tema
                        ]}
                        placeholder="Escribe tu nota aquí..."
                        multiline={true}
                        textAlignVertical="top" // Para Android
                        numberOfLines={4} // Sugerencia inicial (Android)
                        value={observacion}
                        onChangeText={setObservacion}
                      />
                  </View>
                  {
                    fecharegistro &&(<Text style={[ {fontFamily: fonts.bodybold.fontFamily,fontSize:15,marginLeft:'15%',marginTop:5}]}> F. Reg.: {fecharegistro} - Id reg: {Idmarca_sel}</Text>)
                  }

                  <View style={{flexDirection: "row",width:'100%',justifyContent:'space-between'}}>

                    
                    {
                      Idmarca_sel>0 &&(
                        <TouchableOpacity 
                            style={{ 
                          
                              backgroundColor: "#351a1a", 
                              height: 50,
                              justifyContent: 'center', 
                              alignItems: 'center', 
                              borderRadius: 20,
                              width:'45%',
                              marginTop:20,
                              marginBottom:20
                            }} 
                            onPress={showDialogeliminar}
                          >
                            <Text style={{
                              fontSize: 20,
                              color: colors.BotonTextActive, 
                              fontFamily: fonts.bodybold.fontFamily,
                              marginTop:-5
                              
                            }}>
                            ELIMINAR
                            </Text>
                          
                    </TouchableOpacity>
                      )
                    }
                    <TouchableOpacity 
                            style={{ 
                          
                              backgroundColor: colors.BotonActive, 
                              height: 50,
                              justifyContent: 'center', 
                              alignItems: 'center', 
                              borderRadius: 20,
                              width:Idmarca_sel > 0 ? '45%' : '100%',
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
                            REGISTRAR
                            </Text>
                          
                    </TouchableOpacity>
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
    bodycontainer:{
      padding:10,
      flex: 1
    },
    buttonContainer: {
      flexDirection: "row",
      marginTop:2,
      width:'40%',
      justifyContent:'space-between'
    },
    fechascontainer:{
      width:'80%',
      marginLeft:'10%',
      flexDirection:'row',
      justifyContent:'space-between',
      
    },
    textfechas:{
      fontSize:20
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
    botonintensidad:{
      height:100,
      width:100,
      borderWidth:1,
      borderRadius:20,
      justifyContent:'center',
      alignItems:'center'
    },
    botonintensidadimagen:{
      width: '80%',
      height: '80%',
    },
    textintensidad:{
      fontSize:18,
      marginTop:-10
    },
    containerintensidad:{
      marginTop:50,
      
      flexDirection:'row',
      width:'100%',
      justifyContent:'space-between',
      borderWidth:1,
      paddingTop:25,
      paddingLeft:10,
      paddingRight:10,
      borderRadius:20,
      borderColor:'gray'
    }
    ,
    containeritemintensidad:{
      
      alignContent:'center',
      alignItems:'center',
      justifyContent:'center'
    },
    containerTituloIntensidad:{
      position: "absolute",
      top: -25,
      left: "20%",
      transform: [{ translateX: -50 }], // Centra el texto horizontalmente
      
      paddingHorizontal: 10,
    },
    tituloIntensidad:{
      fontSize: 17,
      

    }
   ,
   containernota:{
    marginTop:50,
    width:'100%',
    borderWidth:1,
    paddingTop:5,
    paddingLeft:10,
    paddingRight:10,
    borderRadius:20,
    borderColor:'gray'
  }
    
   
  });