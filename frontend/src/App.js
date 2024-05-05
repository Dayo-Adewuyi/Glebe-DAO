import "./App.css"
import Pages from "./components/pages/Pages"
import { ChakraProvider } from '@chakra-ui/react'
import { AppProvider } from "./context/AppContext"
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


function App() {



  return (
    <ChakraProvider>
      <AppProvider>
       
          <Pages /> 
          <ToastContainer />
      </AppProvider>
    </ChakraProvider>
  );
}

export default App;

