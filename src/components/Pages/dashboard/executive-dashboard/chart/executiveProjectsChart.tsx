import ImageWithBasePath from "@/core/common/imageWithBasePath";
import React from "react";

interface ExecutiveProject {
  id: number;
  executive_img: string;
  executive_name: string;
  deal: string;
  dealStatus: string;
  revenue: string;
  conversion: string;
  conversionName: string;
  status: string;
}

const executiveProjects: ExecutiveProject[] = [
  {
    id: 1,
    executive_img: "assets/img/profiles/avatar-25.jpg",
    executive_name: "Robert Johnson",
    deal: "98",
    dealStatus: "0",
    revenue: "$7500",
    conversion: "0",
    conversionName: "100%",
    status: "0",
  },
  {
    id: 2,
    executive_img: "assets/img/profiles/avatar-04.jpg",
    executive_name: "Isabella Cooper",
    deal: "87",
    dealStatus: "0",
    revenue: "$2000",
    conversion: "0",
    conversionName: "100%",
    status: "0",
  },
  {
    id: 3,
    executive_img: "assets/img/profiles/avatar-27.jpg",
    executive_name: "John Smith",
    deal: "56",
    dealStatus: "1",
    revenue: "$1600",
    conversion: "1",
    conversionName: "85%",
    status: "1",
  },
  {
    id: 4,
    executive_img: "assets/img/profiles/avatar-07.jpg",
    executive_name: "Sophia Parker",
    deal: "10",
    dealStatus: "2",
    revenue: "$600",
    conversion: "2",
    conversionName: "30%",
    status: "2",
  },
  {
    id: 5,
    executive_img: "assets/img/profiles/avatar-08.jpg",
    executive_name: "Ethan Reynolds",
    deal: "87",
    dealStatus: "0",
    revenue: "$2800",
    conversion: "0",
    conversionName: "100%",
    status: "0",
  },
  {
    id: 6,
    executive_img: "assets/img/profiles/avatar-09.jpg",
    executive_name: "Liam Carter",
    deal: "87",
    dealStatus: "1",
    revenue: "$6955",
    conversion: "1",
    conversionName: "85%",
    status: "2",
  },
];

const ExecutiveProjectTable: React.FC = () => {
  const getDealClass = (status: string): string => {
    if (status === "0") {
      return "text-success";
    }

    if (status === "1") {
      return "text-info";
    }

    return "text-danger";
  };

  const getConversionClass = (conversion: string): string => {
    if (conversion === "0") {
      return "badge-soft-success";
    }

    if (conversion === "1") {
      return "badge-soft-info";
    }

    return "badge-soft-primary";
  };

  const getStatusDetails = (
    status: string,
  ): { className: string; name: string } => {
    if (status === "0") {
      return {
        className: "bg-success text-white",
        name: "Excellent",
      };
    }

    if (status === "1") {
      return {
        className: "bg-info text-white",
        name: "Good",
      };
    }

    return {
      className: "bg-danger text-white",
      name: "Average",
    };
  };

  return (
    <div className="table-responsive">
      <table id="executive-project" className="table">
        <thead>
          <tr>
            <th>Executive</th>
            <th>Deals</th>
            <th>Revenue</th>
            <th>Conversion</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          {executiveProjects.map((executive) => {
            const statusDetails = getStatusDetails(executive.status);

            return (
              <tr key={executive.id}>
                {/* Executive */}
                <td>
                  <p className="d-flex align-items-center fs-14 mb-0">
                    <a
                      href="#"
                      className="avatar avatar-sm avatar-rounded border me-2"
                    >
                      <ImageWithBasePath
                        className="img-fluid"
                        src={executive.executive_img}
                        alt="User Image"
                      />
                    </a>

                    <a href="#">{executive.executive_name}</a>
                  </p>
                </td>

                {/* Deals */}
                <td>
                  <p
                    className={`fw-medium mb-0 ${getDealClass(
                      executive.dealStatus,
                    )}`}
                  >
                    {executive.deal || ""}
                  </p>
                </td>

                {/* Revenue */}
                <td>{executive.revenue}</td>

                {/* Conversion */}
                <td>
                  <span
                    className={`badge badge-pill ${getConversionClass(
                      executive.conversion,
                    )}`}
                  >
                    {executive.conversionName || ""}
                  </span>
                </td>

                {/* Status */}
                <td>
                  <span
                    className={`badge badge-pill ${statusDetails.className}`}
                  >
                    {statusDetails.name}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default ExecutiveProjectTable;
