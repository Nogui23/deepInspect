def extraerInfoVulners(data):
    cve_info = []

    for cve_item in data.get('cve', []):
        cve_details = {
            "CVE_ID": cve_item.get('id'),
            "Title": cve_item.get('title'),
            "Description": cve_item.get('description'),
            "References": cve_item.get('href'),
            "Published": cve_item.get('published'),
            "CVSS_Score": cve_item.get('cvss', {}),
            "CVSS3_Score": cve_item.get('cvss3', {}),
            "Last_Seen": cve_item.get('lastseen'),
            "Modified": cve_item.get('modified'),
        }
        cve_info.append(cve_details)

    return cve_info
