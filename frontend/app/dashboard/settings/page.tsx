import ChangePasswordForm from '@/components/dashboard/change-password-form';
import UpdateProfileForm from '@/components/dashboard/update-profile-form';

export default function SettingsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account settings and set e-mail preferences.
        </p>
      </div>
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <UpdateProfileForm />
        <ChangePasswordForm />
      </div>
    </div>
  );
}