import { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';


export default function ComposeButton() {
  const [isOpen, setIsOpen] = useState(false);

  const togglePopup = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div>
      <button
        onClick={togglePopup}
        className="fixed bottom-10 right-10 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700"
      >
        Compose
      </button>
      {isOpen && <ComposeEmailForm closePopup={togglePopup} />}
    </div>
  );
}

function ComposeEmailForm({ closePopup }) {
  const [initialValues, setInitialValues] = useState({
    to: '',
    from:'onboarding@resend.dev',
    cc: '',
    bcc: '',
    subject: '',
    body: '',
    userId:2
  });

    const validationSchema = Yup.object().shape({
      to: Yup.string().email('Invalid email').required('To field is required'),
      cc: Yup.string().email('Invalid email').nullable(),
      bcc: Yup.string().email('Invalid email').nullable(),
      subject: Yup.string().required('Subject field is required'),
      body: Yup.string().required('Test field is required'),
    });
    const handleSend = async (values, { setSubmitting, resetForm }) => {
      console.log('Sending email data:', values);
  
      try {
        const response = await fetch('/api/send', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(values),
        });
  
        if (response.ok) {
          const data = await response.json();
          console.log('Email sent successfully:', data);
          resetForm();
          closePopup();
        } else {
          console.error('Failed to send email');
        }
      } catch (error) {
        console.error('Error sending email:', error);
      } finally {
        setSubmitting(false);
      }
    };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
    <div className="bg-white rounded-lg shadow-lg w-11/12 md:w-3/4 lg:w-1/2">
      <div className="flex justify-between items-center p-4 border-b">
        <h2 className="text-xl font-semibold">New Message</h2>
        <button onClick={closePopup} className="text-xl">&times;</button>
      </div>
      <div className="p-4 space-y-4">
      <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSend}
          >
            {({ isSubmitting }) => (
              <Form className="space-y-4">
                <div>
                  <label className="block text-gray-700">To</label>
                  <Field
                    type="email"
                    name="to"
                    className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <ErrorMessage name="to" component="div" className="text-red-500" />
                </div>
                <div className="flex space-x-2">
                  <div className="flex-1">
                    <label className="block text-gray-700">Cc</label>
                    <Field
                      type="email"
                      name="cc"
                      className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <ErrorMessage name="cc" component="div" className="text-red-500" />
                  </div>
                  <div className="flex-1">
                    <label className="block text-gray-700">Bcc</label>
                    <Field
                      type="email"
                      name="bcc"
                      className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <ErrorMessage name="bcc" component="div" className="text-red-500" />
                  </div>
                </div>
                <div>
                  <label className="block text-gray-700">Subject</label>
                  <Field
                    type="text"
                    name="subject"
                    className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <ErrorMessage name="subject" component="div" className="text-red-500" />
                </div>
                <div>
                  <label className="block text-gray-700">Message</label>
                  <Field
                    as="textarea"
                    name="body"
                    className="w-full p-2 border rounded h-40 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <ErrorMessage name="body" component="div" className="text-red-500" />
                </div>
                <div className="flex justify-between items-center">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
                  >
                    {isSubmitting ? 'Sending...' : 'Send'}
                  </button>
                  <button
                    type="button"
                    onClick={closePopup}
                    className="text-gray-600 hover:text-gray-800 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        {/* <div>
          <input
            type="email"
            placeholder="To"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>
        <div className="flex space-x-2">
          <input
            type="email"
            placeholder="Cc"
            value={cc}
            onChange={(e) => setCc(e.target.value)}
            className="flex-1 p-2 border rounded"
          />
          <input
            type="email"
            placeholder="Bcc"
            value={bcc}
            onChange={(e) => setBcc(e.target.value)}
            className="flex-1 p-2 border rounded"
          />
        </div>
        <div>
          <input
            type="text"
            placeholder="Subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <textarea
            placeholder="Message"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            className="w-full p-2 border rounded h-40"
          ></textarea>
        </div>
      </div>
      <div className="flex justify-between items-center p-4 border-t">
        <button 
          onClick={handleSend} 
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Send
        </button>
        <button 
          onClick={closePopup} 
          className="text-gray-600"
        >
          Cancel
        </button>
      </div> */}
      </div>
    </div>
  </div>
  );
}


