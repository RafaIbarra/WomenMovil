import React, { useContext,useEffect,useState,useRef  } from 'react';
import {  View,Text,FlatList,TouchableOpacity,StyleSheet,Image,TextInput   } from "react-native";
import { useTheme } from '@react-navigation/native';
import { useNavigation } from "@react-navigation/native";
import Handelstorage from '../../../Storage/handelstorage';
import { AuthContext } from '../../../AuthContext';
import Generarpeticion from '../../../Apis/peticiones';
function Home({navigation}){
  const { navigate } = useNavigation();
  const { colors,fonts } = useTheme();
  const {  actualizarEstadocomponente } = useContext(AuthContext);
  const { estadocomponente } = useContext(AuthContext);
  const { activarsesion, setActivarsesion } = useContext(AuthContext);
  const [calendario,setCalendario]=useState([])
  const [ready,setReady]=useState(false)
  const [idmarca,setIdmarca]=useState(null)
  const [selectedDayId, setSelectedDayId] = useState(null);
  const [selectedDayRange, setSelectedDayRange] = useState([]);
  const [Idregistro,setIdregistro]=useState(0)
  const [marcasyear,setMarcasyear]=useState([])
  const dayRefs = useRef({});

  const intensidadImages = {
    1: require("../../../assets/calendario/blood1.webp"),
    2: require("../../../assets/calendario/blood2.webp"),
    3: require("../../../assets/calendario/blood3.webp"),
  };
  
  const tipoMarcaImages = {
    1: require("../../../assets/calendario/rojizo3.webp"),
    2: require("../../../assets/calendario/tonomarron.webp"),
  };

const handlePress = (diaInfo) => {
  
  // Si el día seleccionado es el mismo que el anterior, no hacer nada
  if (selectedDayId === diaInfo.id || diaInfo.Marca) {
    
    actualizarEstadocomponente('IdDiaSeleccion',diaInfo.id)
    return;
  }
  actualizarEstadocomponente('IdDiaSeleccion',0)
  // Restablecer el borde de los días previamente seleccionados
  if (selectedDayRange) {
    selectedDayRange.forEach((id) => {
      
      if (dayRefs.current[id]) {
        
        dayRefs.current[id].setNativeProps({
          
          style: [
            styles.day,
            {
              //backgroundColor: diaInfo.PerteneceMes ? "white" : "gray",
              borderWidth: 1, // Borde predeterminado (sin selección)
              borderColor: "gray", // Borde predeterminado
            },
          ],
        });
      }
    });
  }

  // Aplicar el nuevo estilo al nuevo rango de días
  const inicio = diaInfo.id;
  const fin = diaInfo.id + 4;
  const newSelectedDayRange = [];
  for (let i = inicio; i < fin; i++) {
    if (marcasyear.includes(i)) {
        continue; // Saltar la iteración si i está en marcasyear
    }

    if (dayRefs.current[i]) {
        dayRefs.current[i].setNativeProps({
            style: [
                styles.day,
                {
                    borderWidth: 2, // Borde de selección
                    borderColor: colors.dateseleccion, // Color de borde azul para el día seleccionado
                },
            ],
        });
        newSelectedDayRange.push(i); // Almacenar los IDs del nuevo rango
    }
  
} 

  // for (let i = inicio; i < fin; i++) {
  //   if (dayRefs.current[i]) {
      
  //     dayRefs.current[i].setNativeProps({
  //       style: [
  //         styles.day,
  //         {
  //           //backgroundColor: diaInfo.PerteneceMes ? "white" : "gray",
  //           borderWidth: 2, // Borde de selección
  //           borderColor: colors.dateseleccion, // Color de borde azul para el día seleccionado
  //         },
  //       ],
  //     });
  //     newSelectedDayRange.push(i); // Almacenar los IDs del nuevo rango
  //   }
  // }

  // Actualizar el estado con el nuevo día seleccionado y su rango
  setSelectedDayId(diaInfo.id);
  setSelectedDayRange(newSelectedDayRange);
  
  const datasel={
    diassel:newSelectedDayRange,
    annosel:diaInfo.AnnoValorFecha,
    messel:diaInfo.MesValorFecha
    ,diavalue:diaInfo.ValorFecha
  }
  
  actualizarEstadocomponente('diasmarcados',datasel)
};
  const seleccion = (diaInfo) => {
    setSelectedDayId(diaInfo.id); // Actualiza el ID del día seleccionado
  };
  useEffect(()=>{
      const unsubscribe = navigation.addListener('focus', () => {

        const cargardatos=async()=>{
          const datestorage=await Handelstorage('obtenerdate');
          

          const anno_storage=datestorage['dataanno']
            const body = {
                year:anno_storage,
                month:0
            };
          if(!estadocomponente.comphome) {

            
            
            const result=estadocomponente.datahome
            
            const registros=result['data'][0]['calendario']
            const registrosyear=result['data'][0]['Marcas']
            setMarcasyear(registrosyear)
            setCalendario(registros)
           
          }else{
            const endpoint='DatosCalendario/'
            const result = await Generarpeticion(endpoint, 'POST', body);
            
            const respuesta=result['resp']
            
            if (respuesta === 200){
                actualizarEstadocomponente('comphome',false)

                actualizarEstadocomponente('datahome',result)
                const registros=result['data'][0]['calendario']
                const registrosyear=result['data'][0]['Marcas']
                setMarcasyear(registrosyear)
                setCalendario(registros)
                
            }else if(respuesta === 403 || respuesta === 401){
              
              await Handelstorage('borrar')
              await new Promise(resolve => setTimeout(resolve, 1000))
              setActivarsesion(false)
            }else{

            }
          }
          
          setReady(true)

        }
        cargardatos()
      })
      return unsubscribe;
    }, [navigation,estadocomponente.comphome]); 


   if(ready){

       return(
            <View style={{ flex: 1} }>
                {/* <Text style={{ marginLeft:'20%',paddingTop:5,fontSize:20,fontFamily: fonts.regularbold.fontFamily}}>{estadocomponente.DiaActual}</Text> */}
                <View style={{padding:5} }>
                  <FlatList
                        data={calendario}
                        renderItem={({ item }) => (
                          <View style={{ padding: 10, borderBottomWidth: 1, borderColor: "#ccc" }}>
                            <Text style={ [ styles.cabecerames, { fontFamily: fonts.regularbold.fontFamily }]}>
                              {item.NombreMes} del {item.AnnoCalendario}
                            </Text>

                            
                            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                              {Object.keys(item.DiasAgrupado).map((dia) => (
                                <View key={dia} style={{ alignItems: "center", flex: 1 }}>
                                  <Text style={[ styles.diasemana, { fontFamily: fonts.bodybold.fontFamily }]}>{dia}</Text>
                                  {item.DiasAgrupado[dia].map((diaInfo) => {
                                    const intensidadImg = intensidadImages[diaInfo.Intensidad] || null;
                                    const tipoMarcaImg = tipoMarcaImages[diaInfo.TipoMarca] || null;
                                    return (
                                      <TouchableOpacity
                                        key={diaInfo.id}
                                        ref={(ref) => {
                                          // Asignamos la referencia del TouchableOpacity
                                          dayRefs.current[diaInfo.id] = ref;
                                        }}
                                        style={[
                                          styles.day,
                                          {
                                            backgroundColor: diaInfo.PerteneceMes ? "white" : "gray",
                                            borderWidth: diaInfo.Marca ? 2 : 1, // Borde inicial sin selección
                                            borderColor: diaInfo.Marca ? colors.dateseleccion : "gray", // Color por defecto
                                            
                                          },
                                        ]}
                                        disabled={!diaInfo.PerteneceMes}
                                        onPress={() => handlePress(diaInfo)} // Cambiar el borde al presionar
                                      >
                                        <View style={{ flexDirection: "row", position: "absolute", top: 2 }}>
                                          {intensidadImg && <Image source={intensidadImg} style={{ width: 12, height: 12, marginRight: 2 }} />}
                                          {tipoMarcaImg && <Image source={tipoMarcaImg} style={{ width: 12, height: 12 }} />}
                                        </View>
                                        <Text style={ [ styles.valordia, {fontFamily: fonts.bodyregular.fontFamily }]} >{diaInfo.DiaValorFecha}</Text>
                                      </TouchableOpacity>
                                    );
                                  })}
                                </View>
                              ))}
                            </View>
                          </View>
                        )}
                        keyExtractor={(item) => item.id.toString()}
                        //keyExtractor={(item) => item.id}
                      />


      
                </View>
                    
    
            </View>
        )
   } 
}
const styles = StyleSheet.create({
    day:{
        borderWidth:1,
        borderColor:'gray',
        width:40,
        height:40,
        marginBottom:5,
        borderRadius:10,
        alignItems:'center',
        justifyContent:'center',
        
    },
    cabecerames:{
      marginBottom: 5,
      fontSize:30
    },
    diasemana:{
      marginBottom: 5,
      fontSize:17
    },
    valordia :{
      fontSize:17
    }
})
export default Home