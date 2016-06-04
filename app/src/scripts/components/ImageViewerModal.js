import React, { PropTypes } from 'react';

import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import { Button, Modal } from 'react-bootstrap';

import Spinner from '../components/Spinner';
import NSViewer from '../components/NSViewer';

const ImageViewerModal = ({weightmapUrl, onHide, onImagesLoaded, loadingImages}) => {
  const images = [
    {
      id: 'anatomical',
      json: false,
      name: 'anatomical',
      colorPalette: 'grayscale',
      cache: true,
      download: '/static/data/anatomical.nii.gz',
      url: '/static/data/anatomical.nii.gz'
    },
    {
      'url': weightmapUrl,
      'name': 'weight map',
      'colorPalette': 'intense red-blue',
      'intent': 'Feature weight:',
      'opacity': 0.8,
      'sign': 'both'
    }
  ];

  return (
    <Modal bsSize='large' show={true} onHide={onHide} aria-labelledby='contained-modal-title-lg'>
      <Modal.Header closeButton>
        <Modal.Title id='contained-modal-title-lg'>Weightmap Viewer</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <NSViewer images={images} onImagesLoaded={onImagesLoaded}/>
        <ReactCSSTransitionGroup transitionName="overlay"
                                 transitionEnterTimeout={100}
                                 transitionLeaveTimeout={100}>
          {loadingImages && [<div className="overlay">&nbsp;</div>,
                             <Spinner opts={{position: 'absolute'}} />]}
        </ReactCSSTransitionGroup>
        <div className="clearfix"></div>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={onHide}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
};

ImageViewerModal.propTypes = {
  loadingImages: PropTypes.bool.isRequired,
  weightmapUrl: PropTypes.string.isRequired,
  onHide: PropTypes.func.isRequired,
  onImagesLoaded: PropTypes.func.isRequired
}

export default ImageViewerModal;
