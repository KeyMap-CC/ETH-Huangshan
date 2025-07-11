import { useState } from 'react';
import { useAccount } from 'wagmi';
import { useReadDaoContractGetMemberDetails } from '../hooks/contractHooks';
import { RoleStatus } from '../hooks/constants';
import MemberList from './components/MemberList';
import Apply from './components/Apply';
import MemberDetails from './components/MemberDetails';

export default function MemberPage() {
  const { address, isConnected } = useAccount();

  // State for form visibility and inputs
  const [showApplyForm, setShowApplyForm] = useState(false);
  const [walletMessage, setWalletMessage] = useState('');

  // Fetch connected wallet's member info only if address is available
  const {
    data: memberDetails,
    isLoading: memberDetailsLoading,
    error: memberDetailsError,
  } = address
    ? useReadDaoContractGetMemberDetails({ args: [address] })
    : { data: null, isLoading: false, error: null };

  // Determine member status
  let memberStatus = RoleStatus.NonExistent;
  let memberData = { name: '', info: '', exitNote: '' };
  if (memberDetails && !memberDetailsLoading && !memberDetailsError) {
    const [name, info, status, exitNote] = memberDetails;
    memberStatus = Number(status);
    memberData = { name, info, exitNote };
  }

  // Handle button clicks
  const handleApplyClick = () => {
    if (!isConnected) {
      setWalletMessage('请先连接钱包');
    } else {
      setWalletMessage('');
      if (memberStatus === RoleStatus.NonExistent) {
        setShowApplyForm(true);
      }
    }
  };

  if (memberDetailsLoading) return <div>更新成员信息...</div>;
  if (memberDetailsError) return <div>错误: {memberDetailsError.message}</div>;

  return (
    <div className="p-4">
      <MemberList />
      <div className="mt-4 flex justify-between">
        {/* <UpdateButton
          memberStatus={memberStatus}
          updateName={updateName}
          updateInfo={updateInfo}
          setShowUpdateForm={setShowUpdateForm}
          setUpdateName={setUpdateName}
          setUpdateInfo={setUpdateInfo}
          setSubmittedInfo={setSubmittedInfo}
        /> */}
        <div className="flex flex-col items-end gap-2">
          {(!isConnected || memberStatus === RoleStatus.NonExistent) && (
            <button
              onClick={handleApplyClick}
              className="rounded bg-green-500 px-4 py-2 text-white hover:bg-green-600"
            >
              申请
            </button>
          )}
          {/* <ExitButton
            memberStatus={memberStatus}
            exitNote={exitNote}
            setShowExitForm={setShowExitForm}
            setExitNote={setExitNote}
            setSubmittedInfo={setSubmittedInfo}
          /> */}
        </div>
      </div>
      {walletMessage && (
        <p className="mt-2 text-sm text-red-500">{walletMessage}</p>
      )}
      {isConnected &&
        memberStatus === RoleStatus.NonExistent &&
        showApplyForm && <Apply />}
      {/* {isConnected &&
        showApplyForm &&
        memberStatus === RoleStatus.NonExistent && (
          <ApplyForm
            onSubmit={handleApplySubmit}
            applyName={applyName}
            setApplyName={setApplyName}
            applyInfo={applyInfo}
            setApplyInfo={setApplyInfo}
          />
        )}
      {isConnected && showUpdateForm && memberStatus === RoleStatus.Active && (
        <UpdateForm
          onSubmit={handleUpdateSubmit}
          updateName={updateName}
          setUpdateName={setUpdateName}
          updateInfo={updateInfo}
          setUpdateInfo={setUpdateInfo}
        />
      )}
      {isConnected && showExitForm && memberStatus === RoleStatus.Active && (
        <ExitForm
          onSubmit={handleExitSubmit}
          exitNote={exitNote}
          setExitNote={setExitNote}
        />
      )} */}
      {isConnected &&
        [
          RoleStatus.Pending,
          RoleStatus.Rejected,
          RoleStatus.Exited,
          RoleStatus.Distrusted,
        ].includes(memberStatus) && (
          <MemberDetails memberData={memberData} memberStatus={memberStatus} />
        )}
    </div>
  );
}
