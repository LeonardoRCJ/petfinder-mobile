import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useContext } from 'react';
import AdminFeedScreen from "./src/adminScreens/AdminFeedScreen";
import AdoptionRequestsScreen from "./src/adminScreens/AdoptionRequestsScreen";
import CreatePetScreen from "./src/adminScreens/CreatePetForm";
import ViewAllPets from "./src/adminScreens/ViewAllPets";
import ViewAllUsers from "./src/adminScreens/ViewAllUsers";
import { AuthContext, AuthProvider } from './src/context/AuthContext';
import AboutScreen from "./src/screens/AboutScreen";
import AdoptionForm from "./src/screens/AdoptionForm";
import FeedScreen from "./src/screens/FeedScreen";
import LoginScreen from "./src/screens/LoginScreen";
import ProfileScreen from "./src/screens/ProfileScreen";
import RegisterScreen from "./src/screens/RegisterScreen";
import UserAdoptionsRequests from "./src/screens/UserAdoptionsRequests";

const Stack = createNativeStackNavigator();

const AuthStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
    </Stack.Navigator>
  );
}

const UserStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="UserFeed" component={FeedScreen} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Screen name="About" component={AboutScreen} />
      <Stack.Screen name="MyAdoptionsRequests" component={UserAdoptionsRequests} />
      <Stack.Screen name="AdoptionForm" component={AdoptionForm} />
    </Stack.Navigator>
  );
}

const AdminStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="AdminFeed" component={AdminFeedScreen} />
      <Stack.Screen name="AdminProfile" component={ProfileScreen} />
      <Stack.Screen name="ViewAllPets" component={ViewAllPets} />
      <Stack.Screen name="ViewAllUsers" component={ViewAllUsers} />
      <Stack.Screen name="AdoptionRequests" component={AdoptionRequestsScreen} />
      <Stack.Screen name="CreateNewPet" component={CreatePetScreen} />
    </Stack.Navigator>
  );
}

const Routes = () => {
  const { user, loading } = useContext(AuthContext);

  if (loading) return null;
  
  if (!user) return <AuthStack />;
  
  return user.role === 'ADMIN' ? <AdminStack /> : <UserStack />;
};

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