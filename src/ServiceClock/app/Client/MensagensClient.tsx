import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import DefaultLayout from '../../components/DefaultLayout';
import MessageChat from '../../components/MessageChat';
import { AuthenticationItem, useAuthentication } from '../../provider/AuthenticationProvider';
import { ServiceFactory, ServiceType } from '../../services/ServiceFactory';
import { ClientService } from '../../services/ClientService';
import { CompanyService } from '../../services/CompanyService';
import Toast from 'react-native-toast-message';

const MensagensClient: React.FC = () => {
    const {authenticationItem} = useAuthentication();
    const [company, setCompany] = useState<any | null>(null);
    const [client, setClient] = useState<any | null>(null);

    const clientService = ServiceFactory.createService(ServiceType.Client) as ClientService;
    const companyService = ServiceFactory.createService(ServiceType.Company) as CompanyService;
    
    useEffect(()=>{
        getMyInformations();
    },[]);

    const getMyInformations = async () =>{
        if(authenticationItem){
            const [data,isSucess] = await clientService.GetClientById(authenticationItem.UserId, authenticationItem);
            if(isSucess){
                setClient(data.client);
                const [dataCompany, isSucessCompany] = await companyService.GetCompanyById(data.client.companyId,authenticationItem);

                if(isSucessCompany){
                    setCompany(dataCompany.company);
                }
            }
        }
    }

    return (
        <>
            {
                company!=null?
                <MessageChat otherUserType='Company' otherUser={company}/>
                :<DefaultLayout>
                    <></>
                </DefaultLayout>
            }
            <Toast/>
        </>
    );
};

export default MensagensClient;