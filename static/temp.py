import keras
import tensorflowjs as tfjs
import tensorflow as tf

model = tf.keras.models.load_model('./OCT_VGG16_aug')

tfjs.converters.save_keras_model(model, 'OCT_VGG16')