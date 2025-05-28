import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useContext } from 'react';
import AdoptionRequestsScreen from "./src/adminScreens/AdoptionRequestsScreen";
import ViewAllPets from "./src/adminScreens/ViewAllPets";
import ViewAllUsers from "./src/adminScreens/ViewAllUsers";
import { AuthContext, AuthProvider } from './src/context/AuthContext';
import AboutScreen from "./src/screens/AboutScreen";
import AdoptionForm from "./src/screens/AdoptionForm";
import FeedScreen from "./src/screens/FeedScreen";
import LoginScreen from "./src/screens/LoginScreen";
import ProfileScreen from "./src/screens/ProfileScreen";
import RegisterScreen from "./src/screens/RegisterScreen";

const Stack = createNativeStackNavigator();

const AuthStack = () => {
  return (
  <Stack.Navigator>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
  </Stack.Navigator>
  );
}

const AppStack = () => {
  return(
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Feed" component={FeedScreen} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Screen name="aboutus" component={AboutScreen} />
      <Stack.Screen name='admin_viewPets' component={ViewAllPets} />
       <Stack.Screen name='admin_viewUsers' component={ViewAllUsers} />
       <Stack.Screen name='AdoptionForm' component={AdoptionForm} />
       <Stack.Screen name='AdoptionsRequests' component={AdoptionRequestsScreen} />
  </Stack.Navigator>
  );
}


const Routes = () => {
  const {token, loading} = useContext(AuthContext)

  if (loading) return null;

  return token ? <AppStack /> : <AuthStack />;
}

const App = () => {
    return (
        <AuthProvider>
            <NavigationContainer>
                <Routes />
            </NavigationContainer>
        </AuthProvider>
    );
};

export default App;
