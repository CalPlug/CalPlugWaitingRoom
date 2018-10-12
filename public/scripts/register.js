function resetForm(){
    $('#name').val('');
    $('#position option').prop('selected', false);
    $('#position option:first-child').prop('selected', true);

    $('#msg').html('');
}

$(function(){
    $('#btnReset').click(function(){
        resetForm();
    });

    $('#btnSubmit').click(function(){
        $('#loadingModal').modal('show');
        $('#msg').html('');
        $.ajax({
            type: "POST",
            url: '/client',
            dataType: "json",
            data: {
                name: $('#name').val(),
                position: $('#position option:selected').text()
            },
            success: function(){
                resetForm();
                $('#msg').html('<span style="color:green;">Signed in successfully! You will be called in soon.</span>');
                setTimeout(function(){
                    $('#msg').html('');
                }, 5000);
            },
            error: function(){
                $('#msg').html('<span style="color:red;">There was some error in your submission. Please try again.</span>');
            },
            complete: function(){
                setTimeout(function(){
                    $('#loadingModal').modal('hide');
                }, 1000);
            }
        });
    });
});