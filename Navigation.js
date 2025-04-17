import React,{useContext} from "react";
import { NavigationContainer,DefaultTheme } from "@react-navigation/native";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator } from "@react-navigation/drawer";
import { View,Text,TouchableOpacity } from "react-native";
import { useTheme } from '@react-navigation/native';
import { useNavigation  } from "@react-navigation/native";

import { AuthContext } from "./AuthContext";

import DrawerContentInicio from "./Componentes/DrawerContentInicio/DrawerContentInicio";
import Loginv3 from "./Componentes/Screens/Login/Loginv3";
import RegistroUsuario from "./Componentes/Screens/RegistroUsuario/RegistroUsuario";
import Home from "./Componentes/Screens/Home/Home";
import Cargando from "./Componentes/Procesando/Cargando";
import Resumen from "./Componentes/Screens/Resumen/Resumen";
import RegistroDiasPeriodo from "./Componentes/Screens/RegistroDiasPeriodo/RegistroDiasPeriodo";
import Periodo from "./Componentes/Screens/Periodo/Perdiodo";
import Compartir from "./Componentes/Screens/Compartir/Compartir";
import Configuraciones from "./Componentes/Screens/Configuraciones/Configuraciones";
import Notificaciones from "./Componentes/Screens/Notificaciones/Notificaciones";

import { Ionicons } from "@expo/vector-icons";
import AntDesign from '@expo/vector-icons/AntDesign';
import { FontAwesome6 } from '@expo/vector-icons';
import Fontisto from '@expo/vector-icons/Fontisto';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Feather from '@expo/vector-icons/Feather';

const rose= {
    'op1': '#fff1f2',
    'op2': '#ffe4e6',
    'op3': '#fecdd3',
    'op4': '#fda4af',
    'op5': '#fb7185',
    'op6': '#f43f5e',
    'op7': '#e11d48',
    'op8': '#be123c',
    'op9': '#9f1239',
    'op10': '#881337',
    'op11': '#4c0519',
}



const MyTheme = {
    ...DefaultTheme,
    fonts: {
  
  
      regular: { fontFamily: 'SenRegular', fontWeight: 'normal' },
      regularbold: { fontFamily: 'SenBold', fontWeight: 'normal' }, 
      bodyregular: { fontFamily: 'bodyRegular', fontWeight: 'normal' }, 
      bodybold: { fontFamily: 'bodyBold', fontWeight: 'normal' }, 
  
      // regular: { fontFamily: 'Roboto', fontWeight: 'normal' },
      // regularbold: { fontFamily: 'Roboto', fontWeight: 'bold' },
      
    },
      colors: {
        ...DefaultTheme.colors,
   
        background:rose.op3,
        backgroundnotificacion:rose.op1,
        InputTextBackground:rose.op3,
        textbordercoloractive:'rgb(44,148,228)',
        textbordercolorinactive:'gray',
        text:'black',
        textcard:'white',
        textsub:'gray',
        color:'red',
        primary:'white',
        tintcolor:'gray',
        // card: 'rgb(28,44,52)', //color de la barra de navegadores
        //card: '#57DCA3', //color de la barra de navegadores UENO
        card: rose.op5, 
        dateseleccion:"#ff0000",
        
        
  
        commentText:'black',
        bordercolor:'#d6d7b3',
        iconcolor:'white',
        botoncolor:'rgb(44,148,228)',
        // acctionsbotoncolor:'#57DCA3',
        acctionsbotoncolor:rose.op8,
        
        subtitulo:'rgba(32,93,93,255)',
        BotonTextActive:'white',
        BotonActive:'#db004e',

        BotonTextInactive:'#db004e',
        BotonInactive:'#5d001d'

        
        
      },
      
  };

const Drawer = createDrawerNavigator();

function DrawerInicio({navigation}){
    const { colors,fonts } = useTheme();
    const sizeicon=25
    const sizefont=18
    const div_heigth=15
    const margin_text=-15
    const {periodo, setPeriodo} = useContext(AuthContext);
    const { navigate } = useNavigation();
    
    const { estadocomponente } = useContext(AuthContext);
  
    return(
  
    <Drawer.Navigator
      screenOptions={{
        headerShown: !estadocomponente.camaracdc, 
        headerTitle: ({}) => (
          <View style={{alignItems:'center',marginTop:10}} >
            <Text style={{ color: colors.textcard,fontSize:30,fontFamily: fonts.regularbold.fontFamily}}>{periodo}</Text>
            <Text style={{ marginTop:-15,color: colors.textcard,fontSize:20,fontFamily: fonts.regularbold.fontFamily}}>{estadocomponente.DiaActual}</Text> 
            
          </View>
        ),
        headerRight:({})=>(
          <View style={{marginRight:20}}>
  
            <TouchableOpacity 
                //  onPress={() => navigate('StackPeriodo')} 
                onPress={() => navigate("OpcionesStackTabs", { screen: 'StackPeriodo'})} 
                 
                >
                
                <Feather name="edit" size={27} color={colors.iconcolor}  />
                      
            </TouchableOpacity>
          </View>
        ),
        headerTitleAlign:'center',
        headerStyle:{elevation:0},
        headerTintColor: colors.textcard,
        drawerLabelStyle: {marginLeft: 0,fontFamily: fonts.bodybold.fontFamily},
        tabBarLabelStyle:{borderWidth:1,bordercolor:'red'},
      
      }}
      drawerContent={DrawerContentInicio}
    >
        <Drawer.Screen name="OpcionesStackTabs" 
        component={OpcionesStackTabs}
        options={{
         
          drawerLabel: ({ color, size,focused }) => {
            
            let familyname
            familyname= focused ? fonts.bodybold.fontFamily : fonts.bodyregular.fontFamily;
            
            return(<View style={{height:div_heigth,alignContent:'center',justifyContent:'center'}}> 
                      <Text style={{color:colors.BotonTextActive,fontSize:sizefont,fontFamily:familyname,marginTop:margin_text}}> Inicio</Text>
                    </View>)
          },
          
          drawerIcon: ({size, color})=>(<AntDesign name="home" size={sizeicon} color={colors.iconcolor} />),
          drawerItemStyle:{borderBottomWidth:1,borderBottomColor:'white',marginBottom:5,marginTop:20}
          
          }}
        />

        <Drawer.Screen name="Configuraciones" 
        component={Configuraciones}
        options={{
         
          drawerLabel: ({ color, size,focused }) => {
            
            let familyname
            familyname= focused ? fonts.bodybold.fontFamily : fonts.bodyregular.fontFamily;
            
            return(<View style={{height:div_heigth,alignContent:'center',justifyContent:'center'}}> 
                    <Text style={{color:colors.BotonTextActive,fontSize:sizefont,fontFamily:familyname,marginTop:margin_text}}>Configuraciones</Text>
                  </View>
                )
          },
          
          drawerIcon: ({size, color})=>(<AntDesign name="setting" size={sizeicon} color={colors.iconcolor}  />),
          drawerItemStyle:{borderBottomWidth:1,borderBottomColor:'white',marginBottom:5,marginTop:20}
          
          }}
        />
        {/* <Drawer.Screen name="GeneracionArchivo" 
        component={Home}
        options={{
         
          drawerLabel: ({ color, size,focused }) => {
            
            let familyname
            familyname= focused ? fonts.bodybold.fontFamily : fonts.bodyregular.fontFamily;
            
            return(<View style={{height:div_heigth,alignContent:'center',justifyContent:'center'}}> 
                    <Text style={{color:colors.BotonTextActive,fontSize:sizefont,fontFamily:familyname,marginTop:margin_text}}> Generar Archivo</Text>
                  </View>
            )
          },
          
          drawerIcon: ({size, color,focused})=>
                    (
                      
                      <MaterialCommunityIcons name="microsoft-excel" size={sizeicon} 
                      color={colors.iconcolor} />
                    )
            ,
          drawerItemStyle:{borderBottomWidth:1,borderBottomColor:'white',marginBottom:5,marginTop:20}
          
          }}
        />
        <Drawer.Screen name="ListaArchivos" 
        component={Home}
        options={{
         
          drawerLabel: ({ color, size,focused }) => {
            
            let familyname
            familyname= focused ? fonts.bodybold.fontFamily : fonts.bodyregular.fontFamily;
            
            return(<View style={{height:div_heigth,alignContent:'center',justifyContent:'center'}}> 
                    <Text style={{color:colors.BotonTextActive,fontSize:sizefont,fontFamily:familyname,marginTop:margin_text}}> Archivos XML</Text>
                   </View>
                  )
          },
          
          drawerIcon: ({size, color})=>(<MaterialCommunityIcons name="archive-clock-outline" size={sizeicon} color={colors.iconcolor}  />),
          drawerItemStyle:{borderBottomWidth:1,borderBottomColor:'white',marginBottom:5,marginTop:20}
          
          }}
        />
         */}
        <Drawer.Screen name="Compartir" 
        component={Compartir}
        options={{
         
          drawerLabel: ({ color, size,focused }) => {
            
            let familyname
            familyname= focused ? fonts.bodybold.fontFamily : fonts.bodyregular.fontFamily;
            
            return(<View style={{height:div_heigth,alignContent:'center',justifyContent:'center'}}> 
                    <Text style={{color:colors.BotonTextActive,fontSize:sizefont,fontFamily:familyname,marginTop:margin_text}}>Compartir</Text>
                  </View>
                )
          },
          
          drawerIcon: ({size, color})=>(<AntDesign name="sharealt" size={sizeicon} color={colors.iconcolor}  />),
          drawerItemStyle:{borderBottomWidth:1,borderBottomColor:'white',marginBottom:5,marginTop:20}
          
          }}
        />
    
    </Drawer.Navigator>
    )
  
}


const MainBottomTabs = createBottomTabNavigator();
function MainTabs({ navigation }) {
  const { colors,fonts } = useTheme();
  const { navigate } = useNavigation();
  const handlePress = () => {
        
    const item={'id':0}
     navigate("RegistroDiasPeriodo", { })
        
      };

 
  
  return (
    <View style={{ flex: 1 }}>

      <MainBottomTabs.Navigator
      initialRouteName="Home"
      screenOptions={{
        tabBarStyle: {
          borderTopLeftRadius: 20, 
          borderTopRightRadius: 20,
          height: 60,
          justifyContent: 'center',
          paddingTop: 5,
          
        },
        
      }}
      >
        <MainBottomTabs.Screen name="Resumen" 
          component={Resumen}
          options={{
            
            tabBarLabel: ({ color, size,focused }) => {
              let colortext
              colortext = focused ? colors.acctionsbotoncolor : colors.textsub;
              let familyname
              familyname= focused ? fonts.regularbold.fontFamily : fonts.regular.fontFamily;
              
              return(<Text style={{color:colortext,fontSize:17,fontFamily:familyname}}> Resumen</Text>)
            },
            tabBarIcon: ({ color, size,focused }) => {
              let colorico
              colorico = focused ? "white" : "gray";
            
              return(

                <Ionicons name="book" color={colorico} size={30} />
              )
            },
            tabBarItemStyle: {
              marginRight: 100, // Aumenta el espacio entre el Tab y el botón central
            },
            headerShown:false
            
            }}
        />
       
      
        <MainBottomTabs.Screen name="Home" 
          component={Home} 
          options={{
            tabBarLabel: ({ color, size,focused }) => {
              let colortext
              colortext = focused ? colors.acctionsbotoncolor : colors.textsub;
              let familyname
              familyname= focused ? fonts.regularbold.fontFamily : fonts.regular.fontFamily;
              
              return(<Text style={{color:colortext,fontSize:17,fontFamily:familyname}}> Calendario</Text>)
            }
            ,
            tabBarIcon: ({ color, size,focused }) => {
              let colorico
              colorico = focused ? "white" : "gray";
            
              return(

                <AntDesign name="calendar" size={22} color={colorico} />
              )
            }
            ,
            
            
            headerShown:false
            }}
          />
        
    
      </MainBottomTabs.Navigator>

      <TouchableOpacity
      style={{
        position: 'absolute',
        bottom: 5,
        left: '50%',
        transform: [{ translateX: -30 }],
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: colors.acctionsbotoncolor,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 10,
        
      }}
      onPress={handlePress}
    >
      <FontAwesome6 name="add" size={40} color="white" />
    </TouchableOpacity>
    </View>
  );
}

const Staktabs= createNativeStackNavigator();
function OpcionesStackTabs({ navigation }){
  return(

  <Staktabs.Navigator screenOptions={{ headerShown: false }}>
    <Staktabs.Screen name="MainTabs2" component={MainTabs} options={{title: 'MainTabs'}} />
    <Staktabs.Screen name="RegistroDiasPeriodo" component={RegistroDiasPeriodo} options={{title: 'StackCargaOpciones'}} /> 


    
      
      {/* <Staktabs.Screen name="CargaArchivoXml" component={CargaArchivoXml} options={{title: 'XmlFileUploader',headerShown: false}} />

      <Staktabs.Screen name="DetalleFactura" component={DetalleFactura} options={{title: 'DetalleFactura',headerShown: false}} />
      <Staktabs.Screen name="EditarFactura" component={CargaManual} options={{title: 'EditarFactura',headerShown: false}} /> */}
      <Staktabs.Screen name="StackPeriodo" 
                            component={Periodo} 
                            options={{headerTitle:'Seleccion Año',
                            headerTitleAlign:'center',
                            
                          }}
        />
    
  </Staktabs.Navigator>
  )

}

const StackInicio = createNativeStackNavigator();
function NavigationLogin(){

    return (
      <StackInicio.Navigator screenOptions={{ headerShown: true }}>
        <StackInicio.Screen name="Login" component={Loginv3} options={{headerShown: false}}/>
        <StackInicio.Screen name="RegistroUsuario" component={RegistroUsuario} options={{headerShown: false}}/>
        <StackInicio.Screen name="RecuperacionConraseña" component={Loginv3} options={{headerShown: false}}/>
        
      </StackInicio.Navigator>
    );
  
  }

function Navigation({notificationData,setNotificationData}) {
    
    const { activarsesion, setActivarsesion } = useContext(AuthContext);
    const { estadocomponente } = useContext(AuthContext);
    return (
  
      <NavigationContainer theme={MyTheme }>
        {notificationData &&(
          <Notificaciones notificationData={notificationData} setNotificationData={setNotificationData}></Notificaciones>
        )

        }
    {activarsesion ? (

      
           
              <>
                {estadocomponente.loading && <Cargando />}
                <DrawerInicio />
              </>
           


          ) : (
            <>
              {estadocomponente.loading && <Cargando />}
              <NavigationLogin />
            </>
          )}
      
  
  
      </NavigationContainer>
    );
  }
  
  export default Navigation;