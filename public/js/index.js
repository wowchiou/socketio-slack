(function() {
  //   const username = prompt('你的名字');
  const socket = io('http://localhost:9000');

  socket.on('nsList', list => {
    let namespaceDiv = '';

    list.forEach(ns => {
      namespaceDiv += `<div class="namespace" ns=${ns.endpoint} ><span><img src=".${ns.img}" alt="${ns.title}" title="${ns.title}聊天區" /></span></div>`;
    });

    $('.namespaces')
      .empty()
      .append(namespaceDiv);

    $(document)
      .find('.namespace')
      .eq(0)
      .addClass('active');

    $(document).on('click', '.namespace', function() {
      $('.namespace').removeClass('active');
      $(this).addClass('active');
      const nsEndpoint = $(this).attr('ns');
      joinNs(nsEndpoint);
    });

    joinNs('/mouse');
  });
})();
