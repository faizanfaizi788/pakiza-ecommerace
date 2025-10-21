import React from 'react';
import UserMenu from '../components/UserMenu';
import { Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

const Dashboard = () => {
  const user = useSelector((state) => state.user);

  console.log('user dashboard', user);
  return (
    <section className="bg-gradient-to-br from-white via-blue-50 to-purple-50 min-h-screen">
      <div className="container mx-auto p-3 grid lg:grid-cols-[250px,1fr]  ">
        {/**left for menu */}
        <div className="py-4 sticky top-24 max-h-[calc(100vh-96px)] overflow-y-auto hidden lg:block border-r border-purple-200">
          <div className="bg-gradient-to-br from-white to-purple-50 rounded-xl p-4 shadow-lg border border-purple-100">
            <UserMenu />
          </div>
        </div>

        {/**right for content */}
        <div className="bg-transparent min-h-[75vh] p-4">
          <Outlet />
        </div>
      </div>
    </section>
  );
};

export default Dashboard;
