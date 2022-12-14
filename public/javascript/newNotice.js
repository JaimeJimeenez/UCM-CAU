'use strict'

$(function() {
    $("#type").change(() => {
        if (($('select[id = type]').val()) === "Felicitacion") {
            let functions = ["Archivo Universitario", "Asesoria Juridica", "Biblioteca", "Centro de Informacion", "Departamentos docentes", "Inspeccion de Servicios", "Oficina de Gestion de Infraestructuras y Mantenimiento", "Servicio de Administracion", "Servicios Informa¡ticos", "Servicio de Documentacion", "Servicio de Imprenta", "Servicio de Cafeteria", "Toda la Universidad"];
               
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
    const administration = ["Registro electronico", "Sede electronica"];
    const comunications = ["Correo electronico", "Google Meet", "Cuenta de Alumno"];
    const conectivity = ["Cortafuegos corporativo", "VPN Acceso remoto", "Wifi Eduroam (ssid: eduroam)"]; 
    const docency = ["Aula virtual", "Moodle: Aula Global", "Plataforma de cursos online Privados"];
    const web = ["Portal de eventos"];

    students.set('Administracion Digital', administration);
    students.set('Comunicaciones', comunications);
    students.set('Conectividad', conectivity);
    students.set('Docencia', docency);
    students.set('Web', web);
    
    return students;
}

function mapNonStudents() {
    const nonStudents = new Map();
    const administration = ["Certificado digital de personal fisica", "Certificado electronico de empleado publico", "Registro electronico", "Sede electronica", "Portafirmas"];
    const comunications = ["Correo electronico", "Google Meet", "Cuenta del personal", "Cuenta generica"];
    const conectivity = ["Conexion por cable en despachos", "Cortafuegos corporativo", "VPN Acceso remoto", "Wifi Eduroam (ssid: eduroam)", "Wifi para visitantes (ssid: UCM-Visitantes"];
    const docency = [ "Blackboard Collaborate", "Listados de clase", "Moodle: Aula Global"];
    const web = ["Analitica Web","Emision de certficado SSL", "Hosting: alojamiento de pa¡ginas web", "Portal de eventos", "Redirecciones web"];

    nonStudents.set('Administracion Digital', administration);
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
        student.get('Administracion Digital').push('Certificado digital de personal fisica');

        // PAS
        let pas = mapNonStudents();
        pas.get('Conectividad').push('Cuenta as la red SARA');
        pas.get('Conectividad').push('Resolucion de nombre de dominio (DNS)');

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

$(function() {
    $('#noticeContent').change(() =>  {
        let content = $('#noticeContent').val();
        if (content === '') $('#noticeButton').attr('disabled', true);
        else $('#noticeButton').attr('disabled', false);
    });
});