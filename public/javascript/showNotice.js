'use strict'

$(function() {
    $('.notice').on('click', (e) => {
        e.preventDefault();
        const id = e.target.parentNode.parentNode.children[0].textContent;
        $.ajax({
            method: 'GET',
            url: 'getNotice/' + id,
            success: function (data, textStatus, jqXHR) {
                console.log(data.notice);
                $('#numberNotice').val(id);
                $('#dateNotice').text('Fecha: ' + data.notice.Date);
                $('#userProfile').text('Perfil: ' + data.notice.Profile);
                $('#typeNotice').text('Aviso: ' + data.notice.Type);
                $('#userNotice').text(data.notice.Name);
                
                if (data.notice.FunctionType === null) $('#functionNotice').text(data.notice.Function);
                else $('#functionNotice').text(data.notice.FunctionType + ': ' + data.notice.Function);
                
                $('#textNotice').text(data.notice.Text);
                
                if (data.notice.Done && !data.notice.Active) $('#comment').text('Este aviso ha sido eliminado por el técnico ' + data.technical.Name + ' debido a: ' + data.notice.Comment);
                else if (data.notice.Done) $('#comment').text(data.notice.Comment);
            },
            error: function (jqXHR, textStatus, errorThrown) {
                alert("Se ha producido un error: " + errorThrown);
            }
        })
    });
});