'use strict'

$(function() {
    $("#type").change(() => {
        if (($('select[id = type]').val()) === "Felicitación") {
            let functions = ["Archivo Universitario", "Asesoría Jurídica", "Biblioteca", "Centro de Información", "Departamentos docentes", "Inspección de Servicios", "Oficina de Gestión de Infraestructuras y Mantenimiento", "Servicio de Administración", "Servicios Informáticos", "Servicio de Documentación", "Servicio de Imprenta", "Servicio de Cafetería", "Toda la Universidad"];
               
            $("#typeFunction").attr("disabled", "disabled");
            $("#function").empty();
            functions.forEach(f => {
                $("#function").append("<option value= '" + f + "'> " + f + "</option>");    
            });
        } 
        else {
            $("#function").empty();
            $("#typeFunction").removeAttr("disabled");
        }
    });
});

function studentFunctions() {
    const student = new Map();
    const administration = ["Certificado digital de personal física", "Registro electrónico", "Sede electrónica"];
    const comunications = ["Correo electrónico", "Google Meet", "Cuenta de Alumno"];
    const conectivity = ["Cortafuegos corporativo", "VPN Acceso remoto", "Wifi Eduroam (ssid: eduroam)"];
    const docency = ["Aula virtual", "Moodle: Aula Global", "Plataforma de cursos online Privados"];
    const web = ["Portal de eventos"];

    student.set('Administración Digital', administration);
    student.set('Comunicaciones', comunications);
    student.set('Conectividad', conectivity);
    student.set('Docencia', docency);
    student.set('Web', web);

    return student;
}

function pasFunctions() {
    const pas = new Map();
    const administration = ["Certificado digital de personal física", "Certificado electrónico de empleado público", "Registro electrónico", "Sede electrónica", "Portafirmas"];
    const comunications = ["Correo electrónico", "Google Meet", "Cuenta del personal", "Cuenta genérica"];
    const conectivity = ["Cuenta as la Red SARA", "Conexión por cable en despachos", "Cortafuegos corporativo", "Resolución de nombres de dominio (DNS)", "VPN Acceso remoto", "Wifi Eduroam (ssid: eduroam)", "Wifi para visitantes (ssid: UCM-Visitantes"];
    const docency = [ "Blackboard Collaborate", "Listados de clase", "Moodle: Aula Global"];
    const web = ["Analítica Web","Emisión de certficado SSL", "Hosting: alojamiento de páginas web", "Portal de eventos", "Redirecciones web"];
       
    pas.set('Administración Digital', administration);
    pas.set('Comunicaciones', comunications);
    pas.set('Conectividad', conectivity);
    pas.set('Docencia', docency);
    pas.set('Web', web);

    return pas;
}

function pdiFunctions() {
    const pdi = new Map();
    const administration = ["Certificado digital de personal física", "Certificado electrónico de empleado público", "Registro electrónico", "Sede electrónica", "Portafirmas"];
    const comunications = ["Correo electrónico", "Google Meet", "Cuenta del personal", "Cuenta genérica"];
    const conectivity = ["Conexión por cable en despachos", "Cortafuegos corporativo", "VPN Acceso remoto", "Wifi Eduroam (ssid: eduroam)", "Wifi para visitantes (ssid: UCM-Visitantes"];
    const docency = ["Aula Virtual" , "Blackboard Collaborate", "Listados de clase", "Moodle: Aula Global"];
    const web = ["Analítica Web","Emisión de certficado SSL", "Hosting: alojamiento de páginas web", "Portal de eventos", "Redirecciones web"];
       
    pdi.set('Administración Digital', administration);
    pdi.set('Comunicaciones', comunications);
    pdi.set('Conectividad', conectivity);
    pdi.set('Docencia', docency);
    pdi.set('Web', web);

    return pdi;
}

function oldStudentFunctions() {
    const oldStudent = new Map();
    const administration = ["Registro electrónico", "Sede electrónica"];
    const comunications = ["Correo electrónico", "Google Meet", "Cuenta de Alumno"];
    const conectivity = [];
    const docency = [];
    const web = ["Portal de eventos"];

    oldStudent.set('Administración Digital', administration);
    oldStudent.set('Comunicaciones', comunications);
    oldStudent.set('Conectividad', conectivity);
    oldStudent.set('Docencia', docency);
    oldStudent.set('Web', web);

    return oldStudent;
}

$(function() {
    $("#typeFunction").change(() => {
        let functions = [];
        let notIn = [];
        let profile = $("#profileUser").text();
        console.log(profile);

        let student = studentFunctions();
        let pas = pasFunctions();
        let pdi = pdiFunctions();
        let oldStudent = oldStudentFunctions();

        const map = new Map();
        map.set("Alumno", student);
        map.set("PAS", pas);
        map.set("PDI", pdi);
        map.set("Antiguo Alumno", oldStudent);

        functions = map.get(profile).get($("select[id = typeFunction").val());
        console.log(functions);

        $("#function").empty();
        functions.forEach(f => {
            console.log(f);
            $("#function").append("<option value= '" + f + "'> " + f + "</option>");    
        });

    });
});