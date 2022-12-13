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

function mapStudents() {
    const students = new Map();
    const administration = ["Registro electrónico", "Sede electrónica"];
    const comunications = ["Correo electrónico", "Google Meet", "Cuenta de Alumno"];
    const conectivity = ["Cortafuegos corporativo", "VPN Acceso remoto", "Wifi Eduroam (ssid: eduroam)"]; 
    const docency = ["Aula virtual", "Moodle: Aula Global", "Plataforma de cursos online Privados"];
    const web = ["Portal de eventos"];

    students.set('Administración Digital', administration);
    students.set('Comunicaciones', comunications);
    students.set('Conectividad', conectivity);
    students.set('Docencia', docency);
    students.set('Web', web);
    
    return students;
}

function mapNonStudents() {
    const nonStudents = new Map();
    const administration = ["Certificado digital de personal física", "Certificado electrónico de empleado público", "Registro electrónico", "Sede electrónica", "Portafirmas"];
    const comunications = ["Correo electrónico", "Google Meet", "Cuenta del personal", "Cuenta genérica"];
    const conectivity = ["Conexión por cable en despachos", "Cortafuegos corporativo", "VPN Acceso remoto", "Wifi Eduroam (ssid: eduroam)", "Wifi para visitantes (ssid: UCM-Visitantes"];
    const docency = [ "Blackboard Collaborate", "Listados de clase", "Moodle: Aula Global"];
    const web = ["Analítica Web","Emisión de certficado SSL", "Hosting: alojamiento de páginas web", "Portal de eventos", "Redirecciones web"];

    nonStudents.set('Administración Digital', administration);
    nonStudents.set('Comunicaciones', comunications);
    nonStudents.set('Conectividad', conectivity);
    nonStudents.set('Docencia', docency);
    nonStudents.set('Web', web);
    
    return nonStudents;
}

$(function() {
    $("#typeFunction").change(() => {
        let functions = [];
        let profile = $("#profileUser").text();

        // Students
        let student = mapStudents();
        student.get('Administración Digital').push('Certificado digital de personal física');

        // PAS
        let pas = mapNonStudents();
        pas.get('Conectividad').push('Cuenta as la red SARA');
        pas.get('Conectividad').push('Resolución de nombre de dominio (DNS)');

        // PDI
        let pdi = mapNonStudents();
        pdi.get('Docencia').push('Aula Virtual');
        pdi.get('Docencia').push('Plataforma de cursos online Privados');

        // Old Student
        let oldStudent = mapStudents();
        oldStudent.delete('Conectividad');
        oldStudent.delete('Docencia');

        const map = new Map();
        map.set("Alumno", student);
        map.set("PAS", pas);
        map.set("PDI", pdi);
        map.set("Antiguo Alumno", oldStudent);

        functions = map.get(profile).get($("select[id = typeFunction").val());

        $("#function").empty();
        functions.forEach(f => {
            $("#function").append("<option value= '" + f + "'> " + f + "</option>");    
        });

    });
});