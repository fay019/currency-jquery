$(document).ready(function (  ) {
    //$('#select-one').select2();
    // creat select

    let currency1 = 'USD';
    let currency2 = 'DKK';
    let sum = 105;
    let url1 = 'http://wifi.1av.at/currency.php' //get currency list
    let url2 = 'http://wifi.1av.at/currency_calc.php' // post data( wieviel" //Number "waehrung1" //String mit Währungscode - von "waehrung2" //String mit Währungscode - nach )
    let url3 = 'http://wifi.1av.at/getflag.php' //post data ( "currency" //String mit Währungscode )
    let currencyArray = [];
    let rate = '';
    let flag = '';
    let $select1 = $('#select-one');
    let $select2 = $('#select-tow');
    let $input = $('input');
    let $submit = $('#submit');
    let $result = $('#result');
    $input.val('');

        /**
         *
         * @param currency {array} currency
         */
    let makeSelectOptions = function (currency){
        for ( let i = 0; i < currency.length; i++ ) {
            (i === 0 ) ?
                $select1.append($('<option>').val(currency[i]).text(currency[i]).attr("selected","selected"))
                :
                $select1.append($('<option>').val(currency[i]).text(currency[i]));
            (i === 1 ) ?
                $select2.append($('<option>').val(currency[i]).text(currency[i]).attr("selected","selected") )
                :
                $select2.append($('<option>').val(currency[i]).text(currency[i]));
        }
            $input.focus(); // point the cursor on the input field, when the page loads
    }
    /**
     *
     * @param wieviel {number}
     * @param waehrung1 {string}
     * @param waehrung2 {string}
     */
    let getRate = function(wieviel, waehrung1, waehrung2){
        waehrung1 = waehrung1.toUpperCase();
        waehrung2 = waehrung2.toUpperCase();
        wieviel = wieviel*1;
        $.ajax({
            url: url2,
            method: "POST",
            data: {
                wieviel,
                waehrung1,
                waehrung2,
            },
            success: function(result, status){
                let txt = rate + ' ' + currency1;
                txt += '<br> = <br>';
                txt += Math.round(result*100)/100 + ' ' + currency2;
                $result.html(txt).toggleClass('d-none');
                $input.val('');
            },
            error: function (xhr){
                const errorMessage = 'statu-> '+xhr.status + ': ' + xhr.statusText;
            }
        })
    }
    /**
     *
     */
    let getCurrency = () => {
        $.ajax({
            url: url1,
            method: 'GET',
            async : true,
            success: function (result) {
                currencyArray = JSON.parse(result).waehrungen;
                makeSelectOptions(currencyArray)
            },
            error: function (xhr){
                const errorMessage = 'statu-> '+xhr.status + ': ' + xhr.statusText;
            },
        })
    }

    /**
     *
     * @param currency {string}
     * @param id  {string}
     * @param parent  {string}
     */
    let getFlags = function( currency, id, parent) {
        console.log(currency)
        currency = currency.toUpperCase();
        $.ajax({
            url: url3,
            method: 'POST',
            async: true,
            data:{
                currency,
            },
            beforeSend: function(){
                $submit.prop('disabled', true).html('Wait')
            },
            complete: function(){
                $submit.prop('disabled', false).html('Submit')
            },
            success: function ( result ) {
                //flag = ;
                imgElement(JSON.parse(result).flag, id, parent)
            },
            error: function (xhr){
                const errorMessage = 'statu-> '+xhr.status + ': ' + xhr.statusText;
            },
        })
    }

    /**
     *creat image element with source id, we put it to the parent div
     * @param src {string} hyperlink
     * @param id {string} without '#'
     * @param parent {string} parent id without '#'
     */
    let imgElement = function (src, id, parent) {
        let hashId = '#'+id;
        parent = '#'+parent;
        $(hashId) ? $(hashId).remove() : '';
        let $img = $('<img>')
            .attr( {
                'src': src,
                'width': '64px',
                'height': '42px',
                'id': id,
            })
            .addClass('m-2')
        $(parent).append($img);
    }

    //region function startRate
    /**
     * hide element and remove text
     * get selected currency value
     * check uf rate is number
     * we call function // getFlag() x2 and getRate
     */
    let startRate = function (  ) {
        $result.html('').addClass('d-none'); // hide the result div
        currency1 = $select1.val(); // take first selected currency
        currency2 = $select2.val(); // take second selected currency
        rate = $input.val()*1; // string to number
        if ( !isFinite(rate) || rate === 0 ) { // if the rate is note number or is equal to 0
            $input.addClass('is-invalid') // bootstrap invalid input is add
        }else {
            $input.removeClass('is-invalid') // remove the invalid class
            getFlags(currency1, 'flag1', 'flagBox1') // get flag for the 1st currency from server
            getFlags(currency2, 'flag2', 'flagBox2') // get flag for the 2nd currency from server
            getRate(rate, currency1, currency2); // get the result from server
        }
    }
    //endregion

    //region the starter // on click or on key up we submit // listener on select both, input field and submit button
    $submit.on('click', function () {
        startRate();
    })
    $input.on('keyup', function (e) {
        console.log(e.key)
        e.key === 'Enter' ? startRate() : '';
    })
    $select1.on('keyup', function (e) {
        console.log(e.key)
        e.key === 'Enter' ? startRate() : '';
    })
    $select2.on('keyup', function (e) {
        console.log(e.key)
        e.key === 'Enter' ? startRate() : '';
    })
    //endregion
    getCurrency();
})