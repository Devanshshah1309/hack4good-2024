import { useAuth } from '@clerk/clerk-react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { authenticatedGet, authenticatedPut } from '../axios';
import { useNavigate, useParams } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { EnrollmentWithVolunteer, Opportunity } from '../../../sharedTypes';
import { QueryKey } from '../constants';

export default function OpportunityPage() {
  const navigate = useNavigate();
  const { getToken } = useAuth();
  const { opportunityId } = useParams();

  const { data } = useQuery({
    queryKey: [QueryKey.OPPORTUNITIES, opportunityId],
    queryFn: async () => {
      return await authenticatedGet<{
        opportunity: Opportunity;
        enrollments: EnrollmentWithVolunteer[];
      }>(
        `/admin/opportunities/${opportunityId}`,
        (await getToken()) || '',
        navigate,
      );
    },
  });

  const queryClient = useQueryClient();

  return (
    <div className="main-container">
      <Sidebar />
      <div className="main">
        <h2>Opportunity</h2>
        <pre>{data && JSON.stringify(data.data, undefined, 2)}</pre>
        {data &&
          data.data.enrollments.map((enrollment) => (
            <div
              key={enrollment.volunteerId}
              style={{ border: '1px solid black' }}
            >
              <p>
                {enrollment.volunteer.firstName} {enrollment.volunteer.lastName}
              </p>
              <p>{enrollment.volunteer.user.email}</p>
              <p>
                adminApproved:
                {String(enrollment.adminApproved)}
              </p>
              <p>
                didAttend:
                {String(enrollment.didAttend)}
              </p>
              <button
                onClick={async () => {
                  await authenticatedPut(
                    `/admin/opportunities/${enrollment.opportunityId}/enrollments/${enrollment.volunteerId}/approval`,
                    { adminApproved: !enrollment.adminApproved },
                    (await getToken()) || '',
                  );
                  queryClient.invalidateQueries({
                    queryKey: [QueryKey.OPPORTUNITIES, opportunityId],
                  });
                }}
              >
                approve/unapprove
              </button>
              <button
                onClick={async () => {
                  await authenticatedPut(
                    `/admin/opportunities/${enrollment.opportunityId}/enrollments/${enrollment.volunteerId}/attendance`,
                    { didAttend: !enrollment.didAttend },
                    (await getToken()) || '',
                  );
                  queryClient.invalidateQueries({
                    queryKey: [QueryKey.OPPORTUNITIES, opportunityId],
                  });
                }}
              >
                mark attendance
              </button>
            </div>
          ))}
      </div>
    </div>
  );
}
