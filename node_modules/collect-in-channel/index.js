var getAtPath = require('get-at-path');

function CreateCollector({ channel, noErrorParamDefault = true }) {
  return CallbackMaker;

  function CallbackMaker({
    props,
    properties,
    noErrorParam = noErrorParamDefault
  }) {
    if (!Array.isArray(props)) {
      props = properties;
    }
    if (noErrorParam) {
      return collectToChannelWithoutErrorParam;
    } else {
      return collectToChannel;
    }

    function collectToChannel(error, body, done) {
      if (error) {
        done(error);
      } else {
        collectToChannelWithoutErrorParam(body, done);
      }
    }

    function collectToChannelWithoutErrorParam(body, done) {
      if (body) {
        props.forEach(addToChannel);
      }
      done(null, channel);

      function addToChannel(property) {
        if (Array.isArray(property) && property.length === 2) {
          let firstElement = property[0];
          if (typeof firstElement === 'function') {
            channel[property[1]] = firstElement(body);
          } else if (typeof firstElement === 'object' && firstElement.path) {
            channel[property[1]] = getAtPath(
              body,
              firstElement.path.split('/')
            );
          } else {
            channel[property[1]] = body[property[0]];
          }
        } else {
          channel[property] = body[property];
        }
      }
    }
  }
}

module.exports = CreateCollector;
