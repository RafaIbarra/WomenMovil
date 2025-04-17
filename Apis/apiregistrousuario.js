
import API_BASE from './ApiBase';

async function ApiRegistroUsuario(datausuario){
    
    
    let data={}
    let resp=0
    let datos={}
    const endpoint='RegistroUsuario/'
    
    const requestOptions = {
        method: 'POST',
        headers: {  'Content-Type': 'application/json',
                    
                },
        body: JSON.stringify({
            

            nombre:datausuario['nombre'],
            apellido:datausuario['apellido'],
            nacimiento:datausuario['nacimiento'],
            user:datausuario['user'],
            correo:datausuario['correo'],
            telefono:datausuario['telefono'],
            password:datausuario['password']
          }),
        }

    const response = await fetch(`${API_BASE}/${endpoint}`, requestOptions);  
        data= await response.json();
        resp= response.status;
        
        datos={data,resp}
        return datos

} 
export default ApiRegistroUsuario