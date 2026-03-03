class WhoisParser:
    @staticmethod
    def estructurar_com(res):
        return {
            "whoisRecord": {
                "fechaCreacion": res['WhoisRecord'].get('createdDate', "No disponible"),
                "fechaActualizacion": res['WhoisRecord'].get('updatedDate', "No disponible"),
                "fechaExpiracion": res['WhoisRecord'].get('expiresDate', "No disponible"),
                "registrante": res['WhoisRecord'].get('registrant', {}).get('name', "No disponible"),
                "organizacion": res['WhoisRecord'].get('registrant', {}).get('organization', "No disponible"),
                "municipio": res['WhoisRecord'].get('registrant', {}).get('state', "No disponible"),
                "pais": res['WhoisRecord'].get('registrant', {}).get('country', "No disponible"),
                "codigoDePais": res['WhoisRecord'].get('registrant', {}).get('countryCode', "No disponible"),
            },
            "contactoAdministrativo": {
                "nombre": res['WhoisRecord'].get('administrativeContact', {}).get('name', "No disponible"),
                "organizacion": res['WhoisRecord'].get('administrativeContact', {}).get('organization', "No disponible"),
                "municipio": res['WhoisRecord'].get('administrativeContact', {}).get('state', "No disponible"),
                "pais": res['WhoisRecord'].get('administrativeContact', {}).get('country', "No disponible"),
                "telefono": res['WhoisRecord'].get('administrativeContact', {}).get('telephone', "No disponible")
            }
        }

    @staticmethod
    def estructurar_es(res):
        return {
            "whoisRecord": {
                "fechaCreacion": res['WhoisRecord'].get('registryData', {}).get('createdDate', "No disponible"),
                "fechaActualizacion": res['WhoisRecord'].get('registryData', {}).get('updatedDate', "No disponible"),
                "fechaExpiracion": "No disponible",
                "registrante": res['WhoisRecord'].get('registryData', {}).get('registrant', {}).get('name', "No disponible"),
                "organizacion": res['WhoisRecord'].get('registryData', {}).get('registrant', {}).get('organization', "No disponible"),
                "municipio": "No disponible",
                "pais": res['WhoisRecord'].get('registryData', {}).get('registrant', {}).get('country', "No disponible"),
                "codigoDePais": res['WhoisRecord'].get('registryData', {}).get('registrant', {}).get('countryCode', "No disponible"),
            }
        }

    @staticmethod
    def estructurar_eus(res):
        return {
            "whoisRecord": {
                "fechaCreacion": res['WhoisRecord'].get('registryData', {}).get('createdDate', "No disponible"),
                "fechaActualizacion": res['WhoisRecord'].get('registryData', {}).get('updatedDate', "No disponible"),
                "fechaExpiracion": res['WhoisRecord'].get('registryData', {}).get('expiresDate', "No disponible"),
                "registrante": res['WhoisRecord'].get('registrarName', "No disponible"),
                "organizacion": res['WhoisRecord'].get('registryData', {}).get('registrant', {}).get('organization', "No disponible"),
                "municipio": res['WhoisRecord'].get('registryData', {}).get('registrant', {}).get('state', "No disponible"),
                "pais": res['WhoisRecord'].get('registryData', {}).get('registrant', {}).get('country', "No disponible"),
                "codigoDePais": res['WhoisRecord'].get('registryData', {}).get('registrant', {}).get('countryCode', "No disponible"),
            },
            "contactoAdministrativo": {
                "pais": res['WhoisRecord'].get('registryData', {}).get('administrativeContact', {}).get('country', "No disponible"),
                "codigoDePais": res['WhoisRecord'].get('registryData', {}).get('administrativeContact', {}).get('countryCode', "No disponible"),
            }
        }
