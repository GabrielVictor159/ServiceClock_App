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
  