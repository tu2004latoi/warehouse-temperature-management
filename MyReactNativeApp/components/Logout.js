import { useContext } from "react"
import { MyAccountContext } from "../../configs/MyContext"
import { Button, View, Text, Alert } from "react-native";
import Styles from "../../styles/Styles";

const Logout = ({navigation}) => {
    const [user, dispatch] = useContext(MyAccountContext);

    const logout = () => {
        dispatch({
            "type":"logout"
        })
        console.info("Đăng xuất");
    }
    return(
        <View style={[Styles.container,{justifyContent: "center"}]}>
            <Text style={[Styles.title, {fontSize: 20}]}> Bạn có chắc muốn ĐĂNG XUẤT ?</Text>
            <Button title="Đăng xuất" color="#d32f2f" onPress={logout}/> 
        </View>
    )
}

export default Logout;