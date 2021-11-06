$( document ).ready( function () { // This is to prevent any jQuery code from running before the document is finished loading
    ////////////////////////// Variable -- SECTION //////////////////////////

    //region all variable
    let currency1, currency2;
    let url1 = 'http://wifi.1av.at/currency.php' //get currency list
    let url2 = 'http://wifi.1av.at/currency_calc.php' // post data( wieviel" //Number "waehrung1" //String mit Währungscode - von "waehrung2" //String mit Währungscode - nach )
    let url3 = 'http://wifi.1av.at/getflag.php' //post data ( "currency" //String mit Währungscode )
    let currencyArray = [];
    let rate = '';
    let $select1 = $( '#select-one' );
    let $select2 = $( '#select-tow' );
    let $input = $( 'input' );
    let $submit = $( '#submit' );
    let $result = $( '#result' );
    //endregion

    ////////////////////////// AJAX -- SECTION //////////////////////////

    //region getCurrency function -- AJAX url1
    /**
     * AJAX call --> url1 -- methode --> GET // response --> {array} (waehrungen[...])
     */
    let getCurrency = () => {
        $.ajax( {
            url:url1,
            method:'GET',
            async:true,
            beforeSend:function () {
                $submit.prop( 'disabled', true ).html( 'Wait' )
            },
            complete:function () {
                $submit.prop( 'disabled', false ).html( 'Submit' )
            },
            success:function ( result ) {
                currencyArray = JSON.parse( result ).waehrungen;
                makeSelectOptions( currencyArray )
            },
            error:function ( xhr ) {
                const errorMessage = 'statu-> ' + xhr.status + ': ' + xhr.statusText;
                $result.html( errorMessage ).toggleClass( 'd-none' ).addClass( 'text-danger' );
            },
        } )
    }
    //endregion

    //region getRate function -- AJAX url2
    /**
     * AJAX call --> url3 -- data --> wieviel {number}, waehrung1 {string}, waehrung2 {string} -- methode --> POST // response --> {string}
     * @param wieviel {number}
     * @param waehrung1 {string}
     * @param waehrung2 {string}
     * @response {string}
     */
    let getRate = function ( wieviel, waehrung1, waehrung2 ) {
        waehrung1 = waehrung1.toUpperCase(); // make it UPPERCASE
        waehrung2 = waehrung2.toUpperCase(); // make it UPPERCASE
        wieviel = wieviel * 1; // make it number
        $.ajax( {
            url:url2,
            method:"POST",
            data:{
                wieviel,
                waehrung1,
                waehrung2,
            },
            beforeSend:function () {
                $submit.prop( 'disabled', true ).html( 'Wait' ) //disable the button and write 'Wait' over 'submit'
            },
            complete:function () {
                $submit.prop( 'disabled', false ).html( 'Submit' ) //enable the button and write 'submit' over 'Wait'
            },
            success:function ( result ) {
                let txt = rate + ' ' + currency1;
                txt += '<br> = <br>';
                txt += Math.round( result * 100 ) / 100 + ' ' + currency2; // the result is rounded to two decimals
                $result.html( txt ).toggleClass( 'd-none' ); // make the div result visible
                $input.val( '' ); // reset the input value
            },
            error:function ( xhr ) { //if error
                const errorMessage = 'statu-> ' + xhr.status + ': ' + xhr.statusText;
                $result.html( errorMessage ).toggleClass( 'd-none' ).addClass( 'text-danger' );
            }
        } )
    }
    //endregion

    //region getFlag function -- AJAX url3
    /**
     * AJAX call --> url3 -- data --> currency {string} UPPERCASE  -- methode --> POST // response --> {string} (flag : 'hyperlink')
     *
     * @param currency {string}  data for server
     * @param id  {string} parameter for imgElement function
     * @param parent  {string}  parameter for imgElement function
     */
    let getFlags = function ( currency, id, parent ) {
        currency = currency.toUpperCase(); // make it UPPERCASE
        $.ajax( { // AJAX
            url:url3,
            method:'POST',
            async:true,
            data:{
                currency,
            },
            beforeSend:function () { // on start
                $submit.prop( 'disabled', true ).html( 'Wait' ) //disable the button and write 'Wait' over 'submit'
            },
            complete:function () { //
                $submit.prop( 'disabled', false ).html( 'Submit' ) //enable the button and write 'submit' over 'Wait'
            },
            success:function ( result ) {
                //flag = ;
                imgElement( JSON.parse( result ).flag, id, parent )
            },
            error:function ( xhr ) {
                const errorMessage = 'statu-> ' + xhr.status + ': ' + xhr.statusText;
                $result.html( errorMessage ).toggleClass( 'd-none' ).addClass( 'text-danger' );
            },
        } )
    }
    //endregion

    ////////////////////////// Function -- SECTION //////////////////////////

    //region makeSelectOptions  function -- parameter {array}
    /**
     * select option maker
     * @param currency {array} currency
     */
    let makeSelectOptions = function ( currency ) {
        for ( let i = 0; i < currency.length; i++ ) { // array loop
            ( i === 0 ) ? //first select begin with the first index [0] selected
                $select1.append( $( '<option>' ).val( currency[ i ] ).text( currency[ i ] ).attr( "selected", "selected" ) )
                :
                $select1.append( $( '<option>' ).val( currency[ i ] ).text( currency[ i ] ) );
            ( i === 1 ) ?  //second select begin with the second index [1] selected
                $select2.append( $( '<option>' ).val( currency[ i ] ).text( currency[ i ] ).attr( "selected", "selected" ) )
                :
                $select2.append( $( '<option>' ).val( currency[ i ] ).text( currency[ i ] ) );
        }
        $input.focus(); // point the cursor on the input field, when the page loads
        getFlags( $select1.val(), 'flag1', 'flagBox1' ) // get flag for the 1st currency from server
        getFlags( $select2.val(), 'flag2', 'flagBox2' ) // get flag for the 1st currency from server
    }
    //endregion

    //region image element creator
    /**
     *creat image element with source id, we put it to the parent div
     * @param src {string} hyperlink
     * @param id {string} without '#'
     * @param parent {string} parent id without '#'
     */
    let imgElement = function ( src, id, parent ) {
        let hashId = '#' + id; // add hash to id
        parent = '#' + parent; // add hash to parent
        $( hashId ) ? $( hashId ).remove() : ''; // if the 'element'-->id exist, we remove it
        let $img = $( '<img>' ) // creat image element
            .attr( { // add attribut
                src:src, // hyperlink
                width:'64px', // width size
                height:'42px', // height size
                id:id, // id
                alt:"flag", // alt
            } )
            .addClass( 'm-2' ) // add bootstrap class margin -2
        $( parent ).append( $img ); // we put the created element to the parent element
    }
    //endregion

    //region function startRate
    /**
     * hide element and remove text
     * get selected currency value
     * check uf rate is number
     * we call function // getFlag() x2 and getRate
     */
    let startRate = function () {
        $result.html( '' ).addClass( 'd-none' ); // hide the result div
        currency1 = $select1.val(); // take first selected currency
        currency2 = $select2.val(); // take second selected currency
        rate = $input.val() * 1; // string to number
        if ( !isFinite( rate ) || rate === 0 ) { // if the rate is note number or is equal to 0
            $input.addClass( 'is-invalid' ) // bootstrap invalid input is add
        } else {
            $input.removeClass( 'is-invalid' ) // remove the invalid class
            getRate( rate, currency1, currency2 ); // get the result from server
        }
    }
    //endregion

    ////////////////////////// Listener -- SECTION //////////////////////////

    //region SUBMIT // on click or on key up we submit // listener on select both, input field and submit button
    /**
     * button listener -> on click
     */
    $submit.on( 'click', function () {
        startRate();
    } )
    /**
     * input listener -> key up
     */
    $input.on( 'keyup', function ( e ) {
        e.key === 'Enter' ? startRate() : '';
    } )
    /**
     * first select - listener -> key up
     */
    $select1.on( 'keyup', function ( e ) {
        e.key === 'Enter' ? startRate() : '';
    } )
    /**
     * second select - listener -> key up
     */
    $select2.on( 'keyup', function ( e ) {
        e.key === 'Enter' ? startRate() : '';
    } )
    //endregion

    //region listener for button if input empty button is disabled
    /**
     * input listener -> if mouse move we check the input empty or not
     */
    $input.on( 'blur', function () {
        if ( $input.val() !== '' ) {
            $submit.prop( 'disabled', false );
        } else {
            $submit.prop( 'disabled', true );
        }
    } )
    /**
     * mouse listener -> if mouse move we check the input empty or not
     */
    $( document ).mousemove( function () {
        if ( $input.val() !== '' ) {
            $submit.prop( 'disabled', false );
        } else {
            $submit.prop( 'disabled', true );
        }
    } );
    //endregion

    //region select listener -- on change put flag
    /**
     * first select listener -> if the selection changed, we get the flag and put it
     */
    $select1.on( 'change', function () {
        getFlags( this.value, 'flag1', 'flagBox1' ) // get flag for the 1st currency from server
    } )
    /**
     * second select listener -> if the selection changed, we get the flag and put it
     */
    $select2.on( 'change', function () {
        getFlags( this.value, 'flag2', 'flagBox2' ) // get flag for the 2nd currency from server
    } )
    //endregion

    ////////////////////////// First Action -- SECTION //////////////////////////
    $input.val( '' );
    $submit.prop( 'disabled', true );
    getCurrency();
} )