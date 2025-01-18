const ContactContent = (phone: string, email: string) => {
    return (
      <div>
        <div className="bg-slate-100 p-2">
          <div className="text-base font-semibold">Email</div>
          <div className="text-sm font-normal text-zinc-800">{email}</div>
        </div>
        <div className="bg-slate-100 p-2">
          <div className="text-base font-semibold">Contact Number</div>
          <div className="text-sm font-normal text-zinc-800">{phone}</div>
        </div>
      </div>
    );
  };

export default ContactContent;