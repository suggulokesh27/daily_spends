// import AddMemberForm from "@/components/members/AddMemberForm";
import MemberList from "@/components/members/MemberList";

export default function MembersPage() {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-950 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* <AddMemberForm onMemberAdded={() => window.location.reload()} /> */}
        <MemberList />
      </div>
    </div>
  );
}
