'use strict'

$(function() {
    $('.notice').on('click', (e) => {
        e.preventDefault();
        const id = e.target.parentNode.parentNode.children[0].textContent;
        
        $.ajax({
            method: 'GET',
            url: 'getNotice/' + id,
            success: function (data, textStatus, jqXHR) {
                $('#numberNotice').val(id);
                $('#dateNotice').text('Fecha: ' + data.notice.Date);
                $('#userProfile').text('Perfil: ' + data.notice.Profile);
                $('#typeNotice').text('Aviso: ' + data.notice.Type);
                $('#userNotice').text(data.notice.Name);
                if (data.notice.FunctionType === null) $('#functionNotice').text(data.notice.Function);
                else $('#functionNotice').text(data.notice.FunctionType + ': ' + data.notice.Function);
                $('#textNotice').text(data.notice.Text);
            },
            error: function (jqXHR, textStatus, errorThrown) {
                alert("Se ha producido un error: " + errorThrown);
            }
        })
    });

    $('#assignModal').on('show.bs.modal', (e) => {
        $.ajax({
            method: 'GET',
            ult: '/user/getTechnicals',
            succes: function(data, textStatus, jqXHR) {
                console.log(data.technicals);
                data.technicals.forEach(technical => {
                    $('#technicals').append("<option value= " + technical.Id + "> " + technical + "</option>")
                });
            },
            error: function(jqXHR, textStatus, errorThrown) {
                alert('Se ha producido un error:' + errorThrown);
            }
        });
    });
});