function createFileFromHex(cleaned_hex) {
 
    console.log('I am here', cleaned_hex);

    var binary = new Array();
    for (var i = 0; i < cleaned_hex.length / 2; i++) {
        var h = cleaned_hex.substr(i * 2, 2);
        binary[i] = parseInt(h, 16);
    }
    var byteArrayR = new Uint8Array(binary);
    //Download
    // var a = window.document.createElement('a');
    // a.href = window.URL.createObjectURL(
    //     new Blob([byteArray], { type: 'application/octet-stream' })
    // );
    // a.download = filename;
    // // Append anchor to body.
    // document.body.appendChild(a);
    // a.click();
    // // Remove anchor from body
    // document.body.removeChild(a);
    var context; // Audio context
    var buf;
    function init() {
        if (!window.AudioContext) {
            if (!window.webkitAudioContext) {
                alert(
                    'Your browser does not support any AudioContext and cannot play back this audio.'
                );
                return;
            }
            window.AudioContext = window.webkitAudioContext;
        }

        context = new AudioContext();
    }
    init();
    function playByteArray(byteArray) {
        var arrayBuffer = new ArrayBuffer(byteArray.length);
        var bufferView = new Uint8Array(arrayBuffer);
        for (i = 0; i < byteArray.length; i++) {
            bufferView[i] = byteArray[i];
        }

        context.decodeAudioData(arrayBuffer, function(buffer) {
            buf = buffer;
            play();
        });
    }

    // Play the loaded file
    function play() {
        // Create a source node from the buffer
        var source = context.createBufferSource();
        source.buffer = buf;
        // Connect to the final output node (the speakers)
        source.connect(context.destination);
        // Play immediately
        source.start(0);
    }
    playByteArray(byteArrayR);
}
AFRAME.registerComponent('refresh-obj', {
    init: function() {
        let ele = this.el;
        this.el.addEventListener('click', function() {
            $.ajax({
                type: 'GET',
                crossDomain: true,
                dataType: 'json',
                url: 'http://localhost:5000/decrypt',
                success: function(jsondata) {
                    createFileFromHex(createFileFromHex(jsondata.decryptedString));
                }
            });
        });
    }
});
