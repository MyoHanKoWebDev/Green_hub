import React, { useEffect, useState } from "react";
import {
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt,
  FaPaperPlane,
} from "react-icons/fa";
import Footer from "../components/common/Footer";
import { toast } from "react-hot-toast";
import axios from "../../api/axios";
import { useAuth } from "../context/AuthContext";

const Contact = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    subject: 'General Inquiry',
    message: "",
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post(
        `/api/user/contact`,
        formData,
      );
      if (res.data.status) {
        toast.success(res.data.message);
        setFormData({ name: "", email: "", subject: "", message: "" }); // Reset form
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        name: user.name,
        email: user.email,
      }));
    }
  }, [user]);

  return (
    <div className="bg-white dark:bg-gray-950 min-h-screen">
      {/* --- HEADER --- */}
      <section className="py-20 bg-lime-50 dark:bg-lime-900/10 text-center rounded-3xl">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white mb-4">
            Let's Grow <span className="text-lime-600">Together</span>
          </h1>
          <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto text-lg">
            Have questions about sustainable practices or want to list your
            eco-products? Our team at GreenTech Co. Ltd is here to help.
          </p>
        </div>
      </section>

      <section className="py-16 container mx-auto px-4">
        <div className="grid lg:grid-cols-3 gap-12">
          {/* --- CONTACT INFO CARDS --- */}
          <div className="space-y-6">
            <div className="p-8 rounded-3xl bg-white border border-slate-100 shadow-sm dark:bg-slate-900 dark:border-slate-800">
              <div className="w-12 h-12 bg-lime-100 text-lime-600 rounded-2xl flex items-center justify-center mb-6">
                <FaMapMarkerAlt className="text-xl" />
              </div>
              <h3 className="text-xl font-bold mb-2 dark:text-white">
                Visit Our Office
              </h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                Mandalay, Myanmar.
                <br />
                GreenTech Co. Ltd HQ
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-white border border-slate-100 shadow-sm dark:bg-slate-900 dark:border-slate-800">
              <div className="w-12 h-12 bg-lime-100 text-lime-600 rounded-2xl flex items-center justify-center mb-6">
                <FaEnvelope className="text-xl" />
              </div>
              <h3 className="text-xl font-bold mb-2 dark:text-white">
                Email Us
              </h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm">
                support@greenhub.com
                <br />
                info@greentech.com.mm
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-white border border-slate-100 shadow-sm dark:bg-slate-900 dark:border-slate-800">
              <div className="w-12 h-12 bg-lime-100 text-lime-600 rounded-2xl flex items-center justify-center mb-6">
                <FaPhoneAlt className="text-xl" />
              </div>
              <h3 className="text-xl font-bold mb-2 dark:text-white">
                Call Us
              </h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm">
                +95 9 682224445
                <br />
                Mon - Fri, 9am - 5pm
              </p>
            </div>
          </div>

          {/* --- CONTACT FORM --- */}
          <div className="lg:col-span-2 bg-slate-50 dark:bg-slate-900/50 rounded-[2rem] p-8 md:p-12">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2 dark:text-slate-300">
                    Your Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full px-5 py-4 rounded-2xl border border-slate-200 bg-white dark:bg-slate-800 dark:border-slate-700 outline-none focus:border-lime-500 transition-all"
                    placeholder="John..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 dark:text-slate-300">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="w-full px-5 py-4 rounded-2xl border border-slate-200 bg-white dark:bg-slate-800 dark:border-slate-700 outline-none focus:border-lime-500 transition-all"
                    placeholder="john@example.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 dark:text-slate-300">
                  Subject
                </label>
                <select
                  value={formData.subject}
                  onChange={(e) =>
                    setFormData({ ...formData, subject: e.target.value })
                  }
                  className="w-full px-5 py-4 rounded-2xl border border-slate-200 bg-white dark:bg-slate-800 dark:border-slate-700 outline-none focus:border-lime-500 transition-all"
                >
                  <option>General Inquiry</option>
                  <option>Eco-Project Collaboration</option>
                  <option>Marketplace Support</option>
                  <option>Feedback</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 dark:text-slate-300">
                  Message
                </label>
                <textarea
                  required
                  value={formData.message}
                  onChange={(e) =>
                    setFormData({ ...formData, message: e.target.value })
                  }
                  rows="5"
                  className="w-full px-5 py-4 rounded-2xl border border-slate-200 bg-white dark:bg-slate-800 dark:border-slate-700 outline-none focus:border-lime-500 transition-all"
                  placeholder="How can we help you?"
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full md:w-auto bg-slate-900 text-white dark:bg-lime-600 px-10 py-4 rounded-full font-bold hover:bg-slate-800 dark:hover:bg-lime-500 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
              >
                {loading ? (
                  "Sending..."
                ) : (
                  <>
                    Send Message <FaPaperPlane />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* --- MINI MAP SECTION (Optional) --- */}
      <section className="container mx-auto px-4 pb-20">
        <div className="w-full h-96 rounded-[2.5rem] overflow-hidden shadow-inner bg-slate-100 ">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d118413.4357223594!2d96.00287106436663!3d21.957585507567793!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x30cb6d23f0d27411%3A0x2414630aa300300!2sMandalay!5e0!3m2!1sen!2smm!4v1715450000000!5m2!1sen!2smm"
            width="100%"
            height="100%"
            style={{
              border: 0,
              filter: "grayscale(100%) contrast(1.2) opacity(0.8)",
            }} // Optional: Make it look sleek
            onMouseOver={(e) => (e.currentTarget.style.filter = "none")} // Becomes colorful on hover
            onMouseOut={(e) =>
              (e.currentTarget.style.filter =
                "grayscale(100%) contrast(1.2) opacity(0.8)")
            }
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Contact;
