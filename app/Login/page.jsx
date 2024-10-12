'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import Alert from '../component/Alert';
import { set } from 'lodash';


export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [role, setRole] = useState('');
  const [software, setSoftware] = useState('');
  const router = useRouter();
  const { data: session, status } = useSession();
  const [isOpened, setIsOpened] = useState(false);
  const [message, setMessage] = useState('');

  const [error, setError] = useState(null);

  if (status === 'loading') {
    return (
      <div className="flex text-black justify-center items-center min-h-screen">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent border-solid rounded-full animate-spin"></div>
      </div>
    );
  }

  if (session && session.user) {
    router.push('/');
    return null; // Return null to avoid rendering the rest of the component
  }

  const handleConnexion = async (e) => {
    e.preventDefault();
  
    const username = e.target['email'].value;
    const password = e.target['password'].value;
  
    const result = await signIn('credentials', {
      redirect: false, // Use false to handle errors manually
      username,
      password,
      callbackUrl: '/' // This URL will be redirected to upon successful login
    });
  
    // The following line will not be executed if redirect is true.
    // If you need to handle errors or other logic, consider server-side redirection.
    if (result.error) {
      setError(result.error);
    }
  }

  const handleInscription = async (e) => {
    setError(null);
    e.preventDefault();
  
    const formData = new FormData();
    formData.append('email', e.target['email'].value);
    formData.append('username', e.target['username'].value);
    formData.append('role', role);
    formData.append('software', software);
    formData.append('password', e.target['password'].value);
    formData.append('firstName', e.target['firstName'].value);
    formData.append('lastName', e.target['lastName'].value);
    formData.append('service', e.target['service'].value);
  
    try {
      const response = await fetch('http://localhost:8080/auth/addNewUser', {
        method: 'POST',
        body: formData, 
      });
  
      const result = await response.json();
  
      if (!response.ok || !result.success) {
        // Display the error message from the response
        throw new Error(result.message || 'Failed to register user');
      }
  
      console.log('User registered successfully:', result);
      setMessage('Inscription bien effectuée');
      setIsOpened(true);
      //window.location.reload();
    } catch (error) {
      console.error('There was a problem with the registration:', error);
      setError(error.message);
      //alert(error.message);  // Display the error message in an alert
    }
  };
  

  const toggleForm = () => {
    setIsLogin(!isLogin);
  };

  return (
    <div className="flex font-cairo w-screen min-h-screen items-center justify-center bg-[url('/img2.jpeg')] bg-no-repeat bg-cover">
      <div className={`relative p-10 bg-white m-auto mx-16 rounded-3xl shadow-2xl shadow-gray-600 ${isLogin ? 'w-full lg:w-1/2' : 'w-full max-w-4xl'}`}>
        {/* Floating 3D Circle */}
        <motion.div
          className="absolute w-64 h-64 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full top-0 -right-20"
          initial={{ opacity: 0, scale: 0.5, rotate: 0 }}
          animate={{ opacity: 1, scale: 1, rotate: 360 }}
          transition={{ duration: 2, ease: 'easeInOut', repeat: Infinity, repeatType: 'reverse' }}
        />

        {/* Form Title */}
        <h1 className="text-5xl border-b-2 border-gray-300  pb-2 px-4 text-gray-900 text-center mb-6">
          {isLogin ? 'Connexion' : 'Inscription'}
        </h1>

        {/* Form */}
        <form className="flex flex-wrap -mx-3" onSubmit={isLogin ? handleConnexion : handleInscription}>
          {/* Left Side */}
          <div className={`w-full ${isLogin ? 'lg:w-full' : 'lg:w-1/2'} px-3`}>
            <div className="mb-4 relative">
              <input
                type="text"
                name='email'
                placeholder="Adresse electronique"
                required
                className="w-full border-2 border-gray-200 shadow-md px-6 py-4 bg-gray-100 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-500"
              />
            </div>

            {/* Conditional Fields for Subscribe */}
            {!isLogin && (
              <>
                {/* Username Input */}
                <div className="mb-4 relative">
                  <input
                    type="text"
                    name='username'
                    placeholder="nom d'utilisateur"
                    required
                    className="w-full border-2 border-gray-200 shadow-md px-6 py-4 bg-gray-100 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-500"
                  />
                </div>

                {/* Role Dropdown */}
                <div className="mb-4 relative">
                  <select
                    value={role}
                    name='role'
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full border-2 border-gray-200 shadow-md px-6 py-4 bg-gray-100 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-500"
                  >
                    <option value="" disabled>Selectionner Role</option>
                    <option value="Responsable Software">Responsable Software</option>
                    <option value="Responsable Hardware">Responsable Hardware</option>
                    <option value="Responsable de Stock">Responsable de Stock</option>
                    <option value="Technicien Logiciel">Technicien Logiciel</option>
                    <option value="Technicien Materiel">Technicien Materiel</option>
                    <option value="Chef de Service">Chef de Service</option>

                  </select>
                </div>

                
                

                {role === 'Technicien Logiciel' && (
                  <div className="mb-4 relative">
                    <input
                      type="text"
                      name='software'
                      placeholder="type de logiciel"
                      value={software}
                      onChange={(e) => setSoftware(e.target.value)}
                      className="w-full border-2 border-gray-200 shadow-md px-6 py-4 bg-gray-100 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-500"
                    />
                  </div>
                )}
              </>
            )}

            {/* Password Input */}
            <div className="mb-6 relative">
              <input
                type="password"
                name='password'
                placeholder="mot de passe"
                required
                className="w-full border-2 border-gray-200 shadow-md px-6 py-4 bg-gray-100 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-500"
              />
            </div>
          </div>

          {/* Right Side */}
          {!isLogin && (
            <div className="w-full lg:w-1/2 px-3">
              <div className="mb-4 relative">
                <input
                  type="text"
                  name='firstName'
                  placeholder="Prenom"
                  required
                  className="w-full border-2 border-gray-200 shadow-md px-6 py-4 bg-gray-100 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-500"
                />
              </div>
              <div className="mb-4 relative">
                <input
                  type="text"
                  name='lastName'
                  placeholder="nom"
                  required
                  className="w-full border-2 border-gray-200 shadow-md px-6 py-4 bg-gray-100 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-500"
                />
              </div>
              <div className="mb-4 relative">
                <input
                  type="text"
                  name='service'
                  placeholder="Service"
                  required
                  className="w-full border-2 border-gray-200 shadow-md px-6 py-4 bg-gray-100 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-500"
                />
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <p className="text-red-500 text-lg font-bold text-center w-full">
              {error}
            </p>
          )}

          {/* Button with hover effect */}
        <motion.button
          type="submit"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-full border-2 border-gray-200 py-4 mt-6 bg-blue-600 text-white font-bold rounded-xl shadow-lg hover:bg-blue-700 transition-all duration-300"
        >
          {isLogin ? 'Connexion' : "S'inscroire"}
        </motion.button>
        </form>

        

        {/* Toggle Link */}
        <p className="text-gray-600 text-center mt-6">
          {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
          <span
            onClick={toggleForm}
            className="text-blue-500 font-semibold cursor-pointer hover:underline transition-all"
          >
            {isLogin ? 'Subscribe' : 'Login'}
          </span>
        </p>
      </div>
      <Alert isOpen={isOpened} onClose={()=>{setIsOpened(false)}}  title="Inscription" message={message} type='success' />
    </div>
  );
}