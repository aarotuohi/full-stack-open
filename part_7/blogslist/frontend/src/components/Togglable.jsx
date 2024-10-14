import { forwardRef, useState, useImperativeHandle } from 'react';
import PropTypes from 'prop-types';

const Togglable = forwardRef(({ buttonLabelShow, children }, ref) => {
  const [visible, setVisible] = useState(false);

 
  useImperativeHandle(ref, () => ({
    toggleVisibility: () => setVisible(!visible),
  }));

  return (
    <div>
     
      {!visible && (
        <button onClick={() => setVisible(true)}>{buttonLabelShow}</button>
      )}

     
      {visible && (
        <div>
          {children}
          <button onClick={() => setVisible(false)}>cancel</button>
        </div>
      )}
    </div>
  );
});


Togglable.propTypes = {
  buttonLabelShow: PropTypes.string.isRequired, 
  children: PropTypes.node.isRequired, 
};


Togglable.displayName = 'Togglable';

export default Togglable;
