import { Linking } from "react-native";

export async function convertUriToBase64(uri: string): Promise<string | null> {
    try {
      const response = await fetch(uri);
      const blob = await response.blob();
  
      return await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64data = reader.result as string;
          resolve(base64data.split(',')[1]);
        };
        reader.onerror = (error) => {
          console.error('Erro ao converter Blob para base64:', error);
          reject(null);
        };
        reader.readAsDataURL(blob);
      });
    } catch (error) {
      console.error('Erro ao converter URI para base64:', error);
      return null;
    }
  }

export const handleDownload = async (file:any) => {
  try {
      const supported = await Linking.canOpenURL(file.uri); 
      if (supported) {
          Linking.openURL(file.uri); 
          console.log('Arquivo aberto para download:', file.uri);
      } else {
          console.error('Não é possível abrir o arquivo:', file.uri);
      }
  } catch (error) {
      console.error('Erro ao tentar abrir o arquivo:', error);
  }
};
  